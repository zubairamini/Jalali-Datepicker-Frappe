## Jalali Calendar

## Introduction
Jalali Calendar for ERPNext is a Frappe app that provides a Jalali (Persian) datepicker across the system. It lets users work in Jalali dates while keeping ERPNext’s underlying data format intact, and it supports an easy switch between Jalali and Gregorian calendars wherever Date fields appear.

## Key Features
1. Jalali Date Selection: A datepicker widget designed for Jalali dates that attaches to Date fields throughout Desk and Dialogs.
2. Gregorian Compatibility: Dates selected in Jalali are converted as needed so ERPNext continues to store Gregorian values consistently.
3. System-Wide Coverage: Works across core ERPNext modules (Sales, Purchase, HR, Accounting) as well as list/report filters.
4. UI Parity with JalaliDatePicker: The UI follows the JalaliDatePicker interaction model (header with month/year navigation, pressable day cells, auto-hide, RTL layout).

## Usage
- Enable Jalali mode using the calendar switcher in the UI.
- Date inputs are detected automatically and activated in Jalali mode.
- If you are extending the integration manually, ensure JalaliDatePicker assets are loaded and activate inputs with:

```
<input type="text" data-jdp>
```

Then initialize the watcher after the field renders:

```
jalaliDatepicker.startWatch({
  autoHide: true,
  useDropDownYears: true,
});
```

#### License

mit
