// Copyright (c) 2024, kanakinfosystems LLP and contributors
// For license information, please see license.txt

frappe.ui.form.on("Islamic Date Setting", {
	refresh(frm) {
		frappe.boot.islamic_date_datepicker_format = frm.doc.islamic_date_datepicker_format;
		frappe.boot.islamic_date_format = frm.doc.islamic_date_format;
	},
});