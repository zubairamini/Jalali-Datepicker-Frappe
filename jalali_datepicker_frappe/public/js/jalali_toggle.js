/******************************************************************
 * Jalali Datepicker Toggle for Frappe / ERPNext
 * Author: Ahmad Zubair Amini
 ******************************************************************/

/* ---------------------------------------------------------------
   GLOBAL STATE
----------------------------------------------------------------*/
let jalali_started = false;
const JALALI_DATE_REGEX = /^(\d{4})\/(\d{2})\/(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
const GREGORIAN_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/* ---------------------------------------------------------------
   JALALI <-> GREGORIAN CONVERSION HELPERS
----------------------------------------------------------------*/
function div(a, b) {
    return Math.floor(a / b);
}

function toJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = gy > 1600 ? 979 : 0;
    gy -= gy > 1600 ? 1600 : 621;
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days =
        365 * gy +
        div(gy2 + 3, 4) -
        div(gy2 + 99, 100) +
        div(gy2 + 399, 400) -
        80 +
        gd +
        g_d_m[gm - 1];
    jy += 33 * div(days, 12053);
    days %= 12053;
    jy += 4 * div(days, 1461);
    days %= 1461;
    if (days > 365) {
        jy += div(days - 1, 365);
        days = (days - 1) % 365;
    }
    const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return { jy, jm, jd };
}

function toGregorian(jy, jm, jd) {
    let gy = jy > 979 ? 1600 : 621;
    jy -= jy > 979 ? 979 : 0;
    let days =
        365 * jy +
        div(jy, 33) * 8 +
        div((jy % 33) + 3, 4) +
        78 +
        jd +
        (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
    gy += 400 * div(days, 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * div(--days, 36524);
        days %= 36524;
        if (days >= 365) {
            days += 1;
        }
    }
    gy += 4 * div(days, 1461);
    days %= 1461;
    if (days > 365) {
        gy += div(days - 1, 365);
        days = (days - 1) % 365;
    }
    let gd = days + 1;
    const sal_a = [
        0,
        31,
        (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];
    let gm = 0;
    for (gm = 1; gm <= 12; gm++) {
        if (gd <= sal_a[gm]) break;
        gd -= sal_a[gm];
    }
    return { gy, gm, gd };
}

function pad2(value) {
    return String(value).padStart(2, "0");
}

function parseDateValue(value, regex) {
    if (!value || typeof value !== "string") return null;
    const match = value.trim().match(regex);
    if (!match) return null;
    return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
        day: parseInt(match[3], 10),
        hour: match[4] ? parseInt(match[4], 10) : null,
        minute: match[5] ? parseInt(match[5], 10) : null,
        second: match[6] ? parseInt(match[6], 10) : null
    };
}

function formatGregorianDate(parts) {
    const date = `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
    if (parts.hour === null) return date;
    return `${date} ${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second || 0)}`;
}

function formatGregorianDisplay(value) {
    const parsed = parseDateValue(value, GREGORIAN_DATE_REGEX);
    if (!parsed) return value;
    const date = `${pad2(parsed.day)}-${pad2(parsed.month)}-${parsed.year}`;
    if (parsed.hour === null) return date;
    return `${date} ${pad2(parsed.hour)}:${pad2(parsed.minute)}:${pad2(parsed.second || 0)}`;
}

function formatJalaliDate(parts) {
    const date = `${parts.year}/${pad2(parts.month)}/${pad2(parts.day)}`;
    if (parts.hour === null) return date;
    return `${date} ${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second || 0)}`;
}

function convertGregorianToJalali(value) {
    const parsed = parseDateValue(value, GREGORIAN_DATE_REGEX);
    if (!parsed) return null;
    const { jy, jm, jd } = toJalali(parsed.year, parsed.month, parsed.day);
    return formatJalaliDate({
        year: jy,
        month: jm,
        day: jd,
        hour: parsed.hour,
        minute: parsed.minute,
        second: parsed.second
    });
}

function convertJalaliToGregorian(value) {
    const parsed = parseDateValue(value, JALALI_DATE_REGEX);
    if (!parsed) return null;
    const { gy, gm, gd } = toGregorian(parsed.year, parsed.month, parsed.day);
    return formatGregorianDate({
        year: gy,
        month: gm,
        day: gd,
        hour: parsed.hour,
        minute: parsed.minute,
        second: parsed.second
    });
}

/* ---------------------------------------------------------------
   DUAL DATE DISPLAY (JALALI + GREGORIAN)
----------------------------------------------------------------*/
function ensureDualDateElement($wrapper) {
    if (!$wrapper || !$wrapper.length) return null;
    let $display = $wrapper.find(".jalali-dual-date");
    if ($display.length) return $display;

    $display = $('<div class="jalali-dual-date" aria-live="polite"></div>');
    const $controlInput = $wrapper.find(".control-input");
    if ($controlInput.length) {
        $controlInput.after($display);
    } else {
        $wrapper.append($display);
    }
    return $display;
}

function getDualDateValues(value, isJalali) {
    if (!value) return null;
    if (isJalali) {
        const gregorian = convertJalaliToGregorian(value);
        if (!gregorian) return null;
        return { gregorian, jalali: value };
    }
    const jalali = convertGregorianToJalali(value);
    if (!jalali) return null;
    return { gregorian: value, jalali };
}

function updateDualDateDisplay($wrapper, value, isJalali) {
    const $display = ensureDualDateElement($wrapper);
    if (!$display) return;
    const values = getDualDateValues(value, isJalali);
    if (!values) {
        $display.text("");
        $display.addClass("is-empty");
        return;
    }
    const gregorianDisplay = formatGregorianDisplay(values.gregorian);
    $display
        .removeClass("is-empty")
        .text(`Gregorian: ${gregorianDisplay} | Shamsi: ${values.jalali}`);
}

function attachDualDateHandlers(field) {
    if (!field || !field.$input || !field.$wrapper) return;
    if (field._jalali_dual_attached) return;
    field._jalali_dual_attached = true;

    const $input = field.$input;
    const $wrapper = field.$wrapper;

    const update = () => {
        updateDualDateDisplay($wrapper, $input.val(), field._jalali_enabled);
    };

    $input.on("jdp:change change blur input", update);
    field._jalali_dual_update = update;
    update();
}

function updateDualDateForField(field) {
    if (field && typeof field._jalali_dual_update === "function") {
        field._jalali_dual_update();
    }
}

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
   CONVERSION HANDLERS FOR FIELDS
----------------------------------------------------------------*/
function syncDisplayToJalali(field) {
    if (!field || !field.$input) return;
    const input = field.$input.get(0);
    if (!input || !input.value) return;
    const jalaliValue = convertGregorianToJalali(input.value);
    if (jalaliValue) {
        input.value = jalaliValue;
    }
}

function syncDisplayToGregorian(field) {
    if (!field || !field.$input) return;
    const input = field.$input.get(0);
    if (!input || !input.value) return;
    const gregorianValue = convertJalaliToGregorian(input.value);
    if (gregorianValue) {
        input.value = gregorianValue;
    }
}

function attachConversionHandlers(field) {
    if (!field || !field.$input) return;
    if (field._jalali_conversion_attached) return;

    field._jalali_conversion_attached = true;
    const $input = field.$input;

    const handler = () => {
        if (!field._jalali_enabled) return;
        const rawValue = $input.val();
        if (!rawValue) {
            field.set_value("");
            return;
        }
        const gregorianValue = convertJalaliToGregorian(rawValue);
        if (!gregorianValue) return;

        if (field._jalali_syncing) return;
        field._jalali_syncing = true;
        Promise.resolve(field.set_value(gregorianValue))
            .then(() => {
                if (field._jalali_enabled) {
                    $input.val(rawValue);
                }
            })
            .finally(() => {
                field._jalali_syncing = false;
            });
    };

    $input.on("jdp:change", handler);
    $input.on("change", handler);
    $input.on("blur", handler);
}

function attachConversionHandlersToInput($input) {
    if (!$input || !$input.length) return;
    const input = $input.get(0);
    if (!input || input._jalali_conversion_attached) return;

    input._jalali_conversion_attached = true;
    $input.on("jdp:change change blur", () => {
        if (!input.hasAttribute("data-jdp")) return;
        if (input._jalali_syncing) return;
        const jalaliValue = input.value;
        if (!jalaliValue) return;
        const gregorianValue = convertJalaliToGregorian(jalaliValue);
        if (!gregorianValue) return;
        input._jalali_syncing = true;
        input.value = gregorianValue;
        $input.trigger("change");
        setTimeout(() => {
            if (input.hasAttribute("data-jdp")) {
                input.value = jalaliValue;
            }
            input._jalali_syncing = false;
        }, 0);
    });
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
        <span class="jalali-toggle-btn" title="Toggle Jalali / Gregorian" role="button">
            <span class="jalali-toggle-option jalali">Shamsi</span>
            <span class="jalali-toggle-option gregorian">Gregorian</span>
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
        toggleBtn.addClass("jalali-on");
    } else {
        toggleBtn.removeClass("jalali-on");
    }

    // Toggle click handler
    toggleBtn.on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        field._jalali_enabled = !field._jalali_enabled;
        
        if (field._jalali_enabled) {
            $(this).addClass("jalali-on");
        } else {
            $(this).removeClass("jalali-on");
        }
        
        applyCalendarMode(field);
        updateDualDateForField(field);
    });

    attachDualDateHandlers(field);
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
        attachConversionHandlers(field);
        syncDisplayToJalali(field);
        
        // Initialize or reinitialize the datepicker
        if (window.jalaliDatepicker && window.jalaliDatepicker.update) {
            setTimeout(() => {
                window.jalaliDatepicker.update(input);
            }, 100);
        }
    } else {
        // Disable Jalali - switch to default
        syncDisplayToGregorian(field);
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

    updateDualDateForField(field);
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
            <span class="jalali-toggle-btn" title="Toggle Jalali / Gregorian" role="button">
                <span class="jalali-toggle-option jalali">Shamsi</span>
                <span class="jalali-toggle-option gregorian">Gregorian</span>
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
            $toggleBtn.addClass('jalali-on');
            $input.attr('data-jdp', '');
            ensureJalaliStarted();
            attachConversionHandlersToInput($input);
            const jalaliValue = convertGregorianToJalali($input.val());
            if (jalaliValue) {
                $input.val(jalaliValue);
            }
        } else {
            $toggleBtn.removeClass('jalali-on');
        }

        const updateDual = () => {
            updateDualDateDisplay($wrapper, $input.val(), $toggleBtn.hasClass("jalali-on"));
        };
        $input.on("jdp:change change blur input", updateDual);
        updateDual();
        
        // Add click handler
        $toggleBtn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = $(this).hasClass('jalali-on');
            const $btn = $(this);
            
            if (isActive) {
                $btn.removeClass('jalali-on');
                const gregorianValue = convertJalaliToGregorian($input.val());
                if (gregorianValue) {
                    $input.val(gregorianValue);
                }
                $input.removeAttr('data-jdp');
                
                // Destroy Jalali datepicker if exists
                if ($input.get(0)._jdp) {
                    $input.get(0)._jdp.destroy();
                }
                
                // Try to trigger Frappe's default datepicker
                $input.trigger('blur').trigger('focus');
            } else {
                $btn.addClass('jalali-on');
                $input.attr('data-jdp', '');
                ensureJalaliStarted();
                attachConversionHandlersToInput($input);
                const jalaliValue = convertGregorianToJalali($input.val());
                if (jalaliValue) {
                    $input.val(jalaliValue);
                }
                
                // Update the datepicker
                if (window.jalaliDatepicker && window.jalaliDatepicker.update) {
                    window.jalaliDatepicker.update($input.get(0));
                }
            }

            updateDual();
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
