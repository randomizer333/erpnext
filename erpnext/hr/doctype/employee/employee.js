// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.provide("erpnext.hr");
erpnext.hr.EmployeeController = frappe.ui.form.Controller.extend({
	setup: function() {
		this.frm.fields_dict.user_id.get_query = function(doc, cdt, cdn) {
			return { query:"frappe.core.doctype.user.user.user_query"} }
		this.frm.fields_dict.reports_to.get_query = function(doc, cdt, cdn) {
			return { query: "erpnext.controllers.queries.employee_query"} }
	},

	onload: function() {
		this.frm.set_query("leave_approver", "leave_approvers", function(doc) {
			return {
				query:"erpnext.hr.doctype.employee_leave_approver.employee_leave_approver.get_approvers",
				filters:{
					user: doc.user_id
				}
			}
		});
	},

	refresh: function() {
		var me = this;
		erpnext.toggle_naming_series();
	},

	date_of_birth: function() {
		return cur_frm.call({
			method: "get_retirement_date",
			args: {date_of_birth: this.frm.doc.date_of_birth}
		});
	},

	salutation: function() {
		if(this.frm.doc.salutation) {
			this.frm.set_value("gender", {
				"Mr": "Male",
				"Ms": "Female"
			}[this.frm.doc.salutation]);
		}
	},
	
});
frappe.ui.form.on('Employee',{
	prefered_contact_email:function(frm){
		frm.events.update_contact(frm)
	},
	personal_email:function(frm){
		frm.events.update_contact(frm)
	},
	company_email:function(frm){
		frm.events.update_contact(frm)
	},
	user_id:function(frm){
		frm.events.update_contact(frm)
	},
	update_contact:function(frm){
		frm.set_value("prefered_email",frm.fields_dict[frappe.model.scrub(frm.doc.prefered_contact_email)].value)
	},
	status: function(frm) {
		return frm.call({
			method: "deactivate_sales_person",
			args: {
				employee: frm.doc.employee,
				status: frm.doc.status
			}
		});
	},
});
cur_frm.cscript = new erpnext.hr.EmployeeController({frm: cur_frm});
