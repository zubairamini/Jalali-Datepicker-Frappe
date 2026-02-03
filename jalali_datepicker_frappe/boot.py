import frappe


def boot_session(bootinfo):
    if frappe.session.user == "Guest":
        return

    default_format = "YYYY/MM/DD"
    bootinfo.enable_shamsi_calendar = False
    bootinfo.shamsi_datepicker_format = default_format
    bootinfo.shamsi_display_format = default_format

    if not frappe.db.exists("DocType", "Shamsi Calendar Settings"):
        return

    try:
        settings = frappe.get_single("Shamsi Calendar Settings")
    except (ImportError, frappe.DoesNotExistError):
        return

    bootinfo.enable_shamsi_calendar = bool(settings.enable_shamsi_calendar)
    bootinfo.shamsi_datepicker_format = settings.shamsi_datepicker_format or default_format
    bootinfo.shamsi_display_format = settings.shamsi_display_format or default_format
