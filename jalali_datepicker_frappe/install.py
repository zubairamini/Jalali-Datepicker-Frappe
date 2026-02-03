import frappe


def after_install():
    if frappe.db.exists("DocType", "Shamsi Calendar Settings"):
        frappe.get_single("Shamsi Calendar Settings")
