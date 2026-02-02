/******************************************************************
 * Jalali Datepicker Toggle for Frappe / ERPNext
 * Author: Ahmad Zubair Amini
 ******************************************************************/

/* ---------------------------------------------------------------
   GLOBAL STATE
----------------------------------------------------------------*/
let jalali_started = false;

/* ---------------------------------------------------------------
   START JALALI DATEPICKER ONLY ONCE
----------------------------------------------------------------*/
function ensureJalaliStarted() {
    if (jalali_started) return;

    if (typeof jalaliDatepicker === "undefined") {
        console.warn("jalaliDatepicker library not loaded");
        return;
    }

    jalaliDatepicker.startWatch({
        autoShow: true,
        autoHide: true
    });

    jalali_started = true;
}

/* ---------------------------------------------------------------
   SYSTEM + LANGUAGE CHECK
----------------------------------------------------------------*/
function shouldEnableJalali() {
    if (!frappe || !frappe.boot) return false;
    
    const settings = frappe.boot.jalali_settings || {};

    if (!settings.enable_jalali) return false;

    if (settings.auto_enable_by_language) {
        return ["fa", "ps", "prs"].includes(frappe.boot.lang);
    }

    return true;
}

/* ---------------------------------------------------------------
   ATTACH TOGGLE ICON TO FIELD
----------------------------------------------------------------*/
function attachJalaliToggle(field) {
    if (!field || !field.$wrapper) return;

    // Check if already attached
    if (field.$wrapper.find(".jalali-toggle-btn").length) return;
    
    // Get the control-input div
    const controlInput = field.$wrapper.find(".control-input");
    if (!controlInput.length) return;
    
    // Create toggle button
    const toggleBtn = $(`
        <span class="jalali-toggle-btn"
              title="Toggle Jalali / Gregorian">
            🇮🇷
        </span>
    `);

    // Add styling to control-input div
    controlInput.css({
        "position": "relative"
    });

    // Append toggle button inside control-input
    controlInput.append(toggleBtn);

    // Set initial state from system settings
    field._jalali_enabled = shouldEnableJalali();
    if (field._jalali_enabled) {
        toggleBtn.addClass("active");
        toggleBtn.text("🇮🇷"); // Jalali icon
    } else {
        toggleBtn.text("🌍"); // Gregorian icon
    }

    // Toggle click handler
    toggleBtn.on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        field._jalali_enabled = !field._jalali_enabled;
        
        if (field._jalali_enabled) {
            $(this).addClass("active").text("🇮🇷");
        } else {
            $(this).removeClass("active").text("🌍");
        }
        
        applyCalendarMode(field);
    });
}

/* ---------------------------------------------------------------
   APPLY CALENDAR MODE (SAFE)
----------------------------------------------------------------*/
function applyCalendarMode(field) {
    if (!field || !field.$input) return;
    
    const input = field.$input.get(0);
    if (!input) return;

    if (field._jalali_enabled) {
        // Enable Jalali
        input.setAttribute("data-jdp", "");
        input.setAttribute("data-jdp-placement", "top");
        input.setAttribute("data-jdp-show-today-btn", "true");
        input.setAttribute("data-jdp-show-empty-btn", "true");
        input.setAttribute("data-jdp-persian-digits", "false");
        input.setAttribute("data-jdp-auto-hide", "true");
        
        ensureJalaliStarted();
        
        // Initialize or reinitialize the datepicker
        if (window.jalaliDatepicker && window.jalaliDatepicker.update) {
            setTimeout(() => {
                window.jalaliDatepicker.update(input);
            }, 100);
        }
    } else {
        // Disable Jalali - switch to default
        input.removeAttribute("data-jdp");
        input.removeAttribute("data-jdp-placement");
        input.removeAttribute("data-jdp-show-today-btn");
        input.removeAttribute("data-jdp-show-empty-btn");
        input.removeAttribute("data-jdp-persian-digits");
        input.removeAttribute("data-jdp-auto-hide");
        
        // Clear any existing datepicker instance
        if (input._jdp) {
            input._jdp.destroy();
            delete input._jdp;
        }
        
        // Trigger Frappe to show default datepicker
        if (field.refresh_input) {
            field.refresh_input();
        }
    }
}

/* ---------------------------------------------------------------
   PROCESS ALL DATE FIELDS IN CURRENT FORM
----------------------------------------------------------------*/
function processAllDateFields() {
    // Check if we have a current form
    if (!window.cur_frm || !window.cur_frm.fields_dict) {
        console.log("No form found, waiting...");
        return;
    }

    if (!shouldEnableJalali()) return;

    // Process all date fields in the current form
    Object.values(window.cur_frm.fields_dict || {}).forEach(field => {
        if (!field || !field.df) return;
        
        if (!["Date", "Datetime"].includes(field.df.fieldtype)) return;
        
        // Check if field is already rendered
        if (!field.$wrapper || !field.$wrapper.length) return;
        
        // Wait a bit for full rendering
        setTimeout(() => {
            try {
                attachJalaliToggle(field);
                applyCalendarMode(field);
            } catch (error) {
                console.error("Error processing field:", field.df.fieldname, error);
            }
        }, 300);
    });
}

/* ---------------------------------------------------------------
   AUTO APPLY ON ALL FORMS
----------------------------------------------------------------*/
if (typeof frappe !== 'undefined') {
    frappe.ui.form.on("*", {
        refresh(frm) {
            console.log("Form refresh triggered for Jalali toggle");
            // Use the form object passed to the callback
            if (frm && frm.fields_dict) {
                Object.values(frm.fields_dict || {}).forEach(field => {
                    if (!field || !field.df) return;
                    
                    if (!["Date", "Datetime"].includes(field.df.fieldtype)) return;
                    
                    // Wait for field to be rendered
                    setTimeout(() => {
                        try {
                            attachJalaliToggle(field);
                            applyCalendarMode(field);
                        } catch (error) {
                            console.error("Error processing field:", field.df.fieldname, error);
                        }
                    }, 500);
                });
            }
        },
        
        after_load(frm) {
            console.log("Form after_load triggered for Jalali toggle");
            setTimeout(() => {
                if (frm && frm.fields_dict) {
                    Object.values(frm.fields_dict || {}).forEach(field => {
                        if (!field || !field.df) return;
                        
                        if (!["Date", "Datetime"].includes(field.df.fieldtype)) return;
                        
                        setTimeout(() => {
                            try {
                                attachJalaliToggle(field);
                                applyCalendarMode(field);
                            } catch (error) {
                                console.error("Error processing field:", field.df.fieldname, error);
                            }
                        }, 300);
                    });
                }
            }, 1000);
        }
    });
}

/* ---------------------------------------------------------------
   DIRECT DOM APPROACH AS FALLBACK
----------------------------------------------------------------*/
function attachToDateFieldsDirectly() {
    if (!shouldEnableJalali()) return;
    
    // Find all date input fields
    $('input[data-fieldtype="Date"], input[data-fieldtype="Datetime"]').each(function() {
        const $input = $(this);
        const $wrapper = $input.closest('.frappe-control');
        
        if (!$wrapper.length) return;
        
        // Check if already has toggle
        if ($wrapper.find('.jalali-toggle-btn').length) return;
        
        // Get the control-input div
        const $controlInput = $input.closest('.control-input');
        if (!$controlInput.length) return;
        
        // Create toggle button
        const $toggleBtn = $(`
            <span class="jalali-toggle-btn"
                  title="Toggle Jalali / Gregorian">
                🇮🇷
            </span>
        `);
        
        // Style the container
        $controlInput.css({
            "position": "relative"
        });
        
        // Add padding to input for the button
        $input.css("padding-right", "35px");
        
        // Add toggle button
        $controlInput.append($toggleBtn);
        
        // Determine initial state
        const shouldEnable = shouldEnableJalali();
        
        if (shouldEnable) {
            $toggleBtn.addClass('active').text('🇮🇷');
            $input.attr('data-jdp', '');
            ensureJalaliStarted();
        } else {
            $toggleBtn.text('🌍');
        }
        
        // Add click handler
        $toggleBtn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = $(this).hasClass('active');
            const $btn = $(this);
            
            if (isActive) {
                $btn.removeClass('active').text('🌍');
                $input.removeAttr('data-jdp');
                
                // Destroy Jalali datepicker if exists
                if ($input.get(0)._jdp) {
                    $input.get(0)._jdp.destroy();
                }
                
                // Try to trigger Frappe's default datepicker
                $input.trigger('blur').trigger('focus');
            } else {
                $btn.addClass('active').text('🇮🇷');
                $input.attr('data-jdp', '');
                ensureJalaliStarted();
                
                // Update the datepicker
                if (window.jalaliDatepicker && window.jalaliDatepicker.update) {
                    window.jalaliDatepicker.update($input.get(0));
                }
            }
        });
    });
}

/* ---------------------------------------------------------------
   INITIALIZATION
----------------------------------------------------------------*/
$(document).ready(function() {
    console.log("Jalali toggle script loaded");
    
    // Initial attachment with delay
    setTimeout(() => {
        attachToDateFieldsDirectly();
        
        // Also try to process form fields if form exists
        if (window.cur_frm) {
            processAllDateFields();
        }
    }, 1500);
    
    // Set up interval to catch dynamically added fields
    const checkInterval = setInterval(() => {
        attachToDateFieldsDirectly();
    }, 2000);
    
    // Stop checking after 30 seconds to avoid performance issues
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 30000);
    
    // Re-attach when new content is added to DOM
    $(document).on('DOMNodeInserted', '.frappe-control', function() {
        if ($(this).find('input[data-fieldtype="Date"], input[data-fieldtype="Datetime"]').length) {
            setTimeout(attachToDateFieldsDirectly, 100);
        }
    });
});