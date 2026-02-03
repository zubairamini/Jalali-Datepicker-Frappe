import frappe


def boot_session(bootinfo):
    if frappe.session.user == "Guest":
        return

    settings = frappe.get_single("Shamsi Calendar Settings")
    bootinfo.enable_shamsi_calendar = bool(settings.enable_shamsi_calendar)
    bootinfo.shamsi_datepicker_format = settings.shamsi_datepicker_format or "YYYY/MM/DD"
    bootinfo.shamsi_display_format = settings.shamsi_display_format or "YYYY/MM/DD"
