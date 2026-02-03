import frappe
from frappe.utils import cint

def boot_session(bootinfo):
	if frappe.session["user"] != "Guest":
		bootinfo.islamic_date_datepicker_format = frappe.db.get_single_value("Islamic Date Setting", "islamic_date_datepicker_format")
		bootinfo.islamic_date_format = frappe.db.get_single_value("Islamic Date Setting", "islamic_date_format")

def bootinfo(bootinfo):
	if frappe.session["user"] != "Guest":
		bootinfo.islamic_date_datepicker_format = frappe.db.get_single_value("Islamic Date Setting", "islamic_date_datepicker_format")
		bootinfo.islamic_date_format = frappe.db.get_single_value("Islamic Date Setting", "islamic_date_format")