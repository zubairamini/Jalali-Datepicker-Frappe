const TYPE_DATE = 'date';
const TYPE_DATETIME = 'datetime';
const ISM_DATE_FORMAT = frappe.boot['islamic_date_datepicker_format'] || 'mm-dd-yyyy';
const ISM_DATE_FORMAT_USER = frappe.boot['islamic_date_format'] || 'mm-dd-yyyy';

const datetime_str_to_user = frappe.datetime.str_to_user;
const frappeDateFormatter = frappe.form.formatters.Date;
const frappeDatetimeFormatter = frappe.form.formatters.Datetime;

function getISMCalendar() {
        return $.calendars.instance('iranian', 'en_US');
    }

function ad2ism(m, type, dateFormat = ISM_DATE_FORMAT) {
    if (!m) { return null; }
    if(m.year() > 2076){
        return false;
    }
    return ad2ism_date(m, type).formatDate(dateFormat);
}

function ad2ism_date(m, type = TYPE_DATE) {
    let adDate;

    if (type == TYPE_DATETIME) {
        adDate = moment(m.clone().toDate(), 'YYYY-MM-DD HH:mm:ss').utc().toDate();
    } else {
        adDate = m.toDate();
    }

    return getISMCalendar().fromJSDate(adDate);
}
function FormatFormDate(value) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDateFormatter(value);

    if (!formatted) { return formatted; }

    const date = frappe.datetime.str_to_obj(value);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATE, ISM_DATE_FORMAT_USER);

    return formatted + '<br />' + ism_date_formatted;
}

function FormatFormDatetime(value) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDatetimeFormatter(value);

    if (!formatted) { return formatted; }

    const date = frappe.datetime.str_to_obj(value);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATETIME, ISM_DATE_FORMAT_USER);

    return formatted + '<br />' + ism_date_formatted;
}

frappe.form.formatters.Date = FormatFormDate;
frappe.form.formatters.Datetime = FormatFormDatetime;

frappe.ui.form.ControlDate = class CustomControlDate extends frappe.ui.form.ControlDate {
    make_input() {
        this.datepicker_ism = true;
        super.make_input();
        this.$ismInput = this.$input.clone();
        this.$ismInput.addClass('hide');
        this.islamic_make_picker();
        this._toggleDatepicker();
    }
    make_wrapper() {
        if (this.only_input) {
            this.$wrapper = $('<div class="form-group frappe-control islamic_datepicker_multi"><span class="isd_switch_btn" title="Switch Calendar"></span>').appendTo(this.parent);
        } else {
            this.$wrapper = $(
                `<div class="frappe-control nd_datepickers_container">
                <div class="form-group">
                    <div class="clearfix">
                        <label class="control-label" style="padding-right: 0px;"></label>
                        <span class="help"></span>
                    </div>
                    <div class="control-input-wrapper islamic_datepicker_multi">
                        <div class="control-input"></div>
                        <span class="isd_switch_btn" title="Switch Calendar"></span>
                        <div class="control-value like-disabled-input" style="display: none;"></div>
                        <div class="islamic_date-conversion small bold" style="padding-left: 8px;">&nbsp;</div>
                        <p class="help-box small text-muted"></p>
                    </div>
                </div>
            </div>`
            ).appendTo(this.parent);
        }
        this.bind_events();
    }
    bind_events() {
        this.$wrapper.on('click', '.isd_switch_btn', (ev) => {
                event.preventDefault();
                event.stopPropagation();
                this.datepicker_ism = !this.datepicker_ism;
                this._toggleDatepicker();
        });
    }
    _toggleDatepicker(){
        if (!this.$ismInput || !this.$ismInput.length) { return; }
        if (this.datepicker_ism === true) {
            this.$ismInput.removeClass('hide');
            this.$input.addClass('hide');
        } else {
            this.$input.removeClass('hide');
            this.$ismInput.addClass('hide');
        }
        this._printDateConversion();
    }
    islamic_make_picker(){
        $(this.$ismInput).removeAttr('readonly');
        this.$input.after(this.$ismInput);
        this.$ismInput.calendarsPicker('destroy');
        this.$ismInput.calendarsPicker({
            calendar: getISMCalendar(),
            dateFormat: ISM_DATE_FORMAT,
            prevText: 'Prev',
            nextText: 'Next',
            todayText: 'Today',
            clearText: 'Clear',
            closeText: 'Close',
            onShow: function(picker) {
                $(picker).find('.calendars-cmd-today').on('click', function() {
                    const calendar = $.calendars.instance('islamic', 'en_US');
                    const today = calendar.newDate();
                    this.$ismInput.calendarsPicker('setDate', today);
                }.bind(this));
            }.bind(this),
            onSelect: this.onISMDateSelect.bind(this),
            onClose: this.onISMDatepickerClose.bind(this)
        });
    }
    onISMDateSelect([cdate]){
        let currentValue = this.get_value();
        let timeInfo;
        if (currentValue) {
            const dateTime = moment(frappe.datetime.str_to_obj(currentValue));
            timeInfo = {
                hours: dateTime.hours(),
                minutes: dateTime.minutes(),
                seconds: dateTime.seconds(),
            };
        }
        let selected_date = cdate && moment(cdate.toJSDate()) || undefined;

        if (selected_date && timeInfo) {
            selected_date.set(timeInfo);
        }

        if (selected_date && moment(this.get_value(), this.date_format).isSame(selected_date)) {
            return;
        }
        this.set_value(selected_date.format(this.date_format));
    }
    onISMDatepickerClose([cdate]){
        this.onISMDateSelect([cdate]);
        this.$ismInput.blur();
    }
    _printDateConversion(){
        let value = this.get_value();
            let dateType;
            if(this.df.fieldtype === 'Date') {
                dateType = TYPE_DATE;
            } else if (this.df.fieldtype === 'Datetime') {
                dateType = TYPE_DATETIME;
            }

            if (!this.can_write()) {
                this.$wrapper.find('.islamic_date-conversion').html('&nbsp;');
                return;
            }

            if (!value) {
                this.$wrapper.find('.islamic_date-conversion').html('&nbsp;');
            } else {
                if (this.datepicker_ism) {
                    this.$wrapper.find('.islamic_date-conversion').html(this.format_for_input(value));
                } else {
                    const selectedDate = moment(value, this.date_format);

                    this.$wrapper.find('.islamic_date-conversion').html(
                        ad2ism(selectedDate, dateType, ISM_DATE_FORMAT_USER)
                    );
                }
            }
    }
    set_formatted_input(value) {
        const spset = super.set_formatted_input(value);
        if (value) {
            let m = moment(frappe.datetime.str_to_obj(value));
            this.$ismInput.val(ad2ism(m) || '');
        } else {
            this.$ismInput.val('');
        }
        this._printDateConversion();
        return spset;
    }
    refresh() {
        super.refresh();
        this._printDateConversion();
        if (!this.can_write()) {
            this.$wrapper.find('.ism_switch_btn').css('display', 'none');
        } else {
            this.$wrapper.find('.ism_switch_btn').css('display', 'block');
        }
    }
}

frappe.ui.form.ControlDatetime = class CustomControlDateDate extends frappe.ui.form.ControlDatetime {
        make_input() {
        this.datepicker_ism = true;
        super.make_input();
        this.$ismInput = this.$input.clone();
        this.$ismInput.addClass('hide');
        this.islamic_make_picker();
        this._toggleDatepicker();
    }
    make_wrapper() {
        if (this.only_input) {
            this.$wrapper = $('<div class="form-group frappe-control islamic_datepicker_multi"><span class="isd_switch_btn" title="Switch Calendar"></span>').appendTo(this.parent);
        } else {
            this.$wrapper = $(
                `<div class="frappe-control nd_datepickers_container">
                <div class="form-group">
                    <div class="clearfix">
                        <label class="control-label" style="padding-right: 0px;"></label>
                        <span class="help"></span>
                    </div>
                    <div class="control-input-wrapper islamic_datepicker_multi">
                        <div class="control-input"></div>
                        <span class="isd_switch_btn" title="Switch Calendar"></span>
                        <div class="control-value like-disabled-input" style="display: none;"></div>
                        <div class="islamic_date-conversion small bold" style="padding-left: 8px;">&nbsp;</div>
                        <p class="help-box small text-muted"></p>
                    </div>
                </div>
            </div>`
            ).appendTo(this.parent);
        }
        this.bind_events();
    }
    bind_events() {
        this.$wrapper.on('click', '.isd_switch_btn', (ev) => {
                event.preventDefault();
                event.stopPropagation();
                this.datepicker_ism = !this.datepicker_ism;
                this._toggleDatepicker();
        });
    }
    _toggleDatepicker(){
        if (!this.$ismInput || !this.$ismInput.length) { return; }
        if (this.datepicker_ism === true) {
            this.$ismInput.removeClass('hide');
            this.$input.addClass('hide');
        } else {
            this.$input.removeClass('hide');
            this.$ismInput.addClass('hide');
        }
        this._printDateConversion();
    }
    islamic_make_picker(){
        $(this.$ismInput).removeAttr('readonly');
        this.$input.after(this.$ismInput);
        this.$ismInput.calendarsPicker('destroy');
        this.$ismInput.calendarsPicker({
            calendar: getISMCalendar(),
            dateFormat: ISM_DATE_FORMAT,
            prevText: 'Prev',
            nextText: 'Next',
            todayText: 'Today',
            i: 'Clear',
            closeText: 'Close',
            onShow: function(picker) {
                $(picker).find('.calendars-cmd-today').on('click', function() {
                    const calendar = $.calendars.instance('islamic', 'en_US');
                    const today = calendar.newDate();
                    this.$ismInput.calendarsPicker('setDate', today);
                }.bind(this));
            }.bind(this),
            onSelect: this.onISMDateSelect.bind(this),
            onClose: this.onISMDatepickerClose.bind(this)
        });
    }
    onISMDateSelect([cdate]){
        let currentValue = this.get_value();
        let timeInfo;
        if (currentValue) {
            const dateTime = moment(frappe.datetime.str_to_obj(currentValue));
            timeInfo = {
                hours: dateTime.hours(),
                minutes: dateTime.minutes(),
                seconds: dateTime.seconds(),
            };
        }
        let selected_date = cdate && moment(cdate.toJSDate()) || undefined;

        if (selected_date && timeInfo) {
            selected_date.set(timeInfo);
        }

        if (selected_date && moment(this.get_value(), this.date_format).isSame(selected_date)) {
            return;
        }
        this.set_value(selected_date.format(this.date_format));
    }
    onISMDatepickerClose([cdate]){
        this.onISMDateSelect([cdate]);
        this.$ismInput.blur();
    }
    _printDateConversion(){
        let value = this.get_value();
            let dateType;
            if(this.df.fieldtype === 'Date') {
                dateType = TYPE_DATE;
            } else if (this.df.fieldtype === 'Datetime') {
                dateType = TYPE_DATETIME;
            }

            if (!this.can_write()) {
                this.$wrapper.find('.islamic_date-conversion').html('&nbsp;');
                return;
            }

            if (!value) {
                this.$wrapper.find('.islamic_date-conversion').html('&nbsp;');
            } else {
                if (this.datepicker_ism) {
                    this.$wrapper.find('.islamic_date-conversion').html(this.format_for_input(value));
                } else {
                    const selectedDate = moment(value, this.date_format);

                    this.$wrapper.find('.islamic_date-conversion').html(
                        ad2ism(selectedDate, dateType, ISM_DATE_FORMAT_USER)
                    );
                }
            }
    }
    set_formatted_input(value) {
        const spset = super.set_formatted_input(value);
        if (value) {
            let m = moment(frappe.datetime.str_to_obj(value));
            this.$ismInput.val(ad2ism(m) || '');
        } else {
            this.$ismInput.val('');
        }
        this._printDateConversion();
        return spset;
    }
    refresh() {
        super.refresh();
        this._printDateConversion();
        if (!this.can_write()) {
            this.$wrapper.find('.ism_switch_btn').css('display', 'none');
        } else {
            this.$wrapper.find('.ism_switch_btn').css('display', 'block');
        }
    }
}


function ReportFormatFormDate(value) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDateFormatter(value);

    if (!formatted) { return formatted; }

    const date = frappe.datetime.str_to_obj(value);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATE, ISM_DATE_FORMAT_USER);

    return formatted + '<br />' + ism_date_formatted;
}

function ReportFormatFormDatetime(value) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDatetimeFormatter(value);

    if (!formatted) { return formatted; }

    const date = frappe.datetime.str_to_obj(value);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATETIME, ISM_DATE_FORMAT_USER);

    return formatted + '<br />' + ism_date_formatted;
}

class CustomDataTable extends DataTable {
    initializeComponents() {
        super.initializeComponents();
        const originalsetColumnHeaderWidth = this.columnmanager.setColumnHeaderWidth;
        const originalsetColumnWidth = this.columnmanager.setColumnWidth;
        this.columnmanager.setColumnHeaderWidth = function(colIndex) {
            originalsetColumnHeaderWidth.call(this, colIndex);
            var column = this.getColumn(colIndex);
            if(['Datetime', 'Date'].includes(column.fieldtype)){
                let $column = this.$columnMap[colIndex];
                $column.style.width = '300' + 'px';
            }
        };
        this.columnmanager.setColumnWidth = function(colIndex, width) {
            var column = this.getColumn(colIndex);
            if(['Datetime', 'Date'].includes(column.fieldtype)){
                width = '300';
            }
            originalsetColumnWidth.call(this, colIndex, width);
            
        };
        const originalgetCellContent = this.cellmanager.getCellContent;
        this.cellmanager.getCellContent = function(cell, refreshHtml = false) {
            var hcontent = originalgetCellContent.call(this, cell, refreshHtml);
            if(!cell.isHeader && !cell.isFilter && cell.column && cell.column.fieldtype != undefined && ['Date', 'Datetime'].includes(cell.column.fieldtype) && cell.content != undefined){
                if(cell.column.fieldtype == 'Date'){
                    cell.html = ReportFormatFormDate(cell.content);
                }
                if(cell.column.fieldtype == 'Datetime'){
                    cell.html = ReportFormatFormDatetime(cell.content);
                }
                hcontent = originalgetCellContent.call(this, cell, refreshHtml); 
            }
            return hcontent;
            
        };
    }
}
window.DataTable = CustomDataTable;
frappe.provide("frappe.views");
frappe.views.QueryReport = class CustomQueryReport extends frappe.views.QueryReport {
    init() {
        var def = super.init();
        return def;
    }
    render_datatable() {
            super.render_datatable();

            if (this.datatable) {
                let columns = this.columns.filter((col) => !col.hidden);
                $(this.datatable.wrapper).empty();
                this.datatable.buildOptions({
                    cellHeight: 47,
                });
                this.datatable.prepare();
                this.datatable.initializeComponents();
                this.datatable.refresh(this.data, columns);
                // this.datatable.columnmanager.applyDefaultSortOrder();
            }
    }
}
frappe.views.ReportView = class CustomReportView extends frappe.views.ReportView {
    setup_datatable(values) {
        this.$datatable_wrapper.empty();
        this.datatable = new window.DataTable(this.$datatable_wrapper[0], {
            columns: this.columns,
            data: this.get_data(values),
            getEditor: this.get_editing_object.bind(this),
            language: frappe.boot.lang,
            translations: frappe.utils.datatable.get_translations(),
            checkboxColumn: true,
            inlineFilters: true,
            cellHeight: 50,
            direction: frappe.utils.is_rtl() ? "rtl" : "ltr",
            events: {
                onRemoveColumn: (column) => {
                    this.remove_column_from_datatable(column);
                },
                onSwitchColumn: (column1, column2) => {
                    this.switch_column(column1, column2);
                },
                onCheckRow: () => {
                    const checked_items = this.get_checked_items();
                    this.toggle_actions_menu_button(checked_items.length > 0);
                },
            },
            hooks: {
                columnTotal: frappe.utils.report_column_total,
            },
            headerDropdown: [
                {
                    label: __("Add Column"),
                    action: (datatabe_col) => {
                        let columns_in_picker = [];
                        const columns = this.get_columns_for_picker();

                        columns_in_picker = columns[this.doctype]
                            .filter((df) => !this.is_column_added(df))
                            .map((df) => ({
                                label: __(df.label, null, df.parent),
                                value: df.fieldname,
                            }));

                        delete columns[this.doctype];

                        for (let cdt in columns) {
                            columns[cdt]
                                .filter((df) => !this.is_column_added(df))
                                .map((df) => ({
                                    label: __(df.label, null, df.parent) + ` (${cdt})`,
                                    value: df.fieldname + "," + cdt,
                                }))
                                .forEach((df) => columns_in_picker.push(df));
                        }

                        const d = new frappe.ui.Dialog({
                            title: __("Add Column"),
                            fields: [
                                {
                                    label: __("Select Column"),
                                    fieldname: "column",
                                    fieldtype: "Autocomplete",
                                    options: columns_in_picker,
                                },
                                {
                                    label: __("Insert Column Before {0}", [
                                        __(datatabe_col.docfield.label).bold(),
                                    ]),
                                    fieldname: "insert_before",
                                    fieldtype: "Check",
                                },
                            ],
                            primary_action: ({ column, insert_before }) => {
                                if (!columns_in_picker.map((col) => col.value).includes(column)) {
                                    frappe.show_alert({
                                        message: __("Invalid column"),
                                        indicator: "orange",
                                    });
                                    d.hide();
                                    return;
                                }

                                let doctype = this.doctype;
                                if (column.includes(",")) {
                                    [column, doctype] = column.split(",");
                                }

                                let index = datatabe_col.colIndex;
                                if (insert_before) {
                                    index = index - 1;
                                }

                                this.add_column_to_datatable(column, doctype, index);
                                d.hide();
                            },
                        });

                        d.show();
                    },
                },
            ],
        });
    }
}