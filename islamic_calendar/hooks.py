app_name = "islamic_calendar"
app_title = "Islamic Calendar"
app_publisher = "aogc LLP."
app_description = "Islamic Calendar"
app_email = "info@aogc.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = [
                "/assets/islamic_calendar/islamic_lib/jquery.calendars.picker.css",
                "/assets/islamic_calendar/css/islamic_calendar.css"]
app_include_js = [
                "islamic_assets.bundle.js"
                ]

boot_session = "islamic_calendar.islamic_calendar.islamic_configure.boot_session"
extend_bootinfo = [
    "islamic_calendar.islamic_calendar.islamic_configure.bootinfo",
]
# include js, css files in header of web template
# web_include_css = "/assets/islamic_calendar/css/islamic_calendar.css"
# web_include_js = "/assets/islamic_calendar/js/islamic_calendar.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "islamic_calendar/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "islamic_calendar/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#   "Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#   "methods": "islamic_calendar.utils.jinja_methods",
#   "filters": "islamic_calendar.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "islamic_calendar.install.before_install"
# after_install = "islamic_calendar.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "islamic_calendar.uninstall.before_uninstall"
# after_uninstall = "islamic_calendar.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "islamic_calendar.utils.before_app_install"
# after_app_install = "islamic_calendar.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "islamic_calendar.utils.before_app_uninstall"
# after_app_uninstall = "islamic_calendar.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "islamic_calendar.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#   "Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#   "Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#   "ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#   "*": {
#       "on_update": "method",
#       "on_cancel": "method",
#       "on_trash": "method"
#   }
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#   "all": [
#       "islamic_calendar.tasks.all"
#   ],
#   "daily": [
#       "islamic_calendar.tasks.daily"
#   ],
#   "hourly": [
#       "islamic_calendar.tasks.hourly"
#   ],
#   "weekly": [
#       "islamic_calendar.tasks.weekly"
#   ],
#   "monthly": [
#       "islamic_calendar.tasks.monthly"
#   ],
# }

# Testing
# -------

# before_tests = "islamic_calendar.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#   "frappe.desk.doctype.event.event.get_events": "islamic_calendar.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#   "Task": "islamic_calendar.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["islamic_calendar.utils.before_request"]
# after_request = ["islamic_calendar.utils.after_request"]

# Job Events
# ----------
# before_job = ["islamic_calendar.utils.before_job"]
# after_job = ["islamic_calendar.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#   {
#       "doctype": "{doctype_1}",
#       "filter_by": "{filter_by}",
#       "redact_fields": ["{field_1}", "{field_2}"],
#       "partial": 1,
#   },
#   {
#       "doctype": "{doctype_2}",
#       "filter_by": "{filter_by}",
#       "partial": 1,
#   },
#   {
#       "doctype": "{doctype_3}",
#       "strict": False,
#   },
#   {
#       "doctype": "{doctype_4}"
#   }
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#   "islamic_calendar.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
#   "Logging DocType Name": 30  # days to retain logs
# }

