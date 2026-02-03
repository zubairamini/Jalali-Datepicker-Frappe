(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../islamic_calendar/islamic_calendar/public/islamic_lib/jquery.plugin.js
  var require_jquery_plugin = __commonJS({
    "../islamic_calendar/islamic_calendar/public/islamic_lib/jquery.plugin.js"(exports, module) {
      (function() {
        "use strict";
        var initializing = false;
        window.JQClass = function() {
        };
        JQClass.classes = {};
        JQClass.extend = function extender(prop) {
          var base = this.prototype;
          initializing = true;
          var prototype = new this();
          initializing = false;
          for (var name in prop) {
            if (typeof prop[name] === "function" && typeof base[name] === "function") {
              prototype[name] = function(name2, fn) {
                return function() {
                  var __super = this._super;
                  this._super = function(args) {
                    return base[name2].apply(this, args || []);
                  };
                  var ret = fn.apply(this, arguments);
                  this._super = __super;
                  return ret;
                };
              }(name, prop[name]);
            } else if (typeof prop[name] === "object" && typeof base[name] === "object" && name === "defaultOptions") {
              var obj1 = base[name];
              var obj2 = prop[name];
              var obj3 = {};
              var key2;
              for (key2 in obj1) {
                obj3[key2] = obj1[key2];
              }
              for (key2 in obj2) {
                obj3[key2] = obj2[key2];
              }
              prototype[name] = obj3;
            } else {
              prototype[name] = prop[name];
            }
          }
          function JQClass2() {
            if (!initializing && this._init) {
              this._init.apply(this, arguments);
            }
          }
          JQClass2.prototype = prototype;
          JQClass2.prototype.constructor = JQClass2;
          JQClass2.extend = extender;
          return JQClass2;
        };
      })();
      (function($) {
        "use strict";
        JQClass.classes.JQPlugin = JQClass.extend({
          name: "plugin",
          defaultOptions: {},
          regionalOptions: {},
          deepMerge: true,
          _getMarker: function() {
            return "is-" + this.name;
          },
          _init: function() {
            $.extend(this.defaultOptions, this.regionalOptions && this.regionalOptions[""] || {});
            var jqName = camelCase(this.name);
            $[jqName] = this;
            $.fn[jqName] = function(options) {
              var otherArgs = Array.prototype.slice.call(arguments, 1);
              var inst = this;
              var returnValue = this;
              this.each(function() {
                if (typeof options === "string") {
                  if (options[0] === "_" || !$[jqName][options]) {
                    throw "Unknown method: " + options;
                  }
                  var methodValue = $[jqName][options].apply($[jqName], [this].concat(otherArgs));
                  if (methodValue !== inst && methodValue !== void 0) {
                    returnValue = methodValue;
                    return false;
                  }
                } else {
                  $[jqName]._attach(this, options);
                }
              });
              return returnValue;
            };
          },
          setDefaults: function(options) {
            $.extend(this.defaultOptions, options || {});
          },
          _attach: function(elem2, options) {
            elem2 = $(elem2);
            if (elem2.hasClass(this._getMarker())) {
              return;
            }
            elem2.addClass(this._getMarker());
            options = $.extend(this.deepMerge, {}, this.defaultOptions, this._getMetadata(elem2), options || {});
            var inst = $.extend({ name: this.name, elem: elem2, options }, this._instSettings(elem2, options));
            elem2.data(this.name, inst);
            this._postAttach(elem2, inst);
            this.option(elem2, options);
          },
          _instSettings: function(elem2, options) {
            return {};
          },
          _postAttach: function(elem2, inst) {
          },
          _getMetadata: function(elem) {
            try {
              var data = elem.data(this.name.toLowerCase()) || "";
              data = data.replace(/(\\?)'/g, function(e, t) {
                return t ? "'" : '"';
              }).replace(/([a-zA-Z0-9]+):/g, function(match, group, i) {
                var count = data.substring(0, i).match(/"/g);
                return !count || count.length % 2 === 0 ? '"' + group + '":' : group + ":";
              }).replace(/\\:/g, ":");
              data = $.parseJSON("{" + data + "}");
              for (var key in data) {
                if (data.hasOwnProperty(key)) {
                  var value = data[key];
                  if (typeof value === "string" && value.match(/^new Date\(([-0-9,\s]*)\)$/)) {
                    data[key] = eval(value);
                  }
                }
              }
              return data;
            } catch (e) {
              return {};
            }
          },
          _getInst: function(elem2) {
            return $(elem2).data(this.name) || {};
          },
          option: function(elem2, name, value2) {
            elem2 = $(elem2);
            var inst = elem2.data(this.name);
            var options = name || {};
            if (!name || typeof name === "string" && typeof value2 === "undefined") {
              options = (inst || {}).options;
              return options && name ? options[name] : options;
            }
            if (!elem2.hasClass(this._getMarker())) {
              return;
            }
            if (typeof name === "string") {
              options = {};
              options[name] = value2;
            }
            this._optionsChanged(elem2, inst, options);
            $.extend(inst.options, options);
          },
          _optionsChanged: function(elem2, inst, options) {
          },
          destroy: function(elem2) {
            elem2 = $(elem2);
            if (!elem2.hasClass(this._getMarker())) {
              return;
            }
            this._preDestroy(elem2, this._getInst(elem2));
            elem2.removeData(this.name).removeClass(this._getMarker());
          },
          _preDestroy: function(elem2, inst) {
          }
        });
        function camelCase(name) {
          return name.replace(/-([a-z])/g, function(match, group) {
            return group.toUpperCase();
          });
        }
        $.JQPlugin = {
          createPlugin: function(superClass, overrides) {
            if (typeof superClass === "object") {
              overrides = superClass;
              superClass = "JQPlugin";
            }
            superClass = camelCase(superClass);
            var className = camelCase(overrides.name);
            JQClass.classes[className] = JQClass.classes[superClass].extend(overrides);
            new JQClass.classes[className]();
          }
        };
      })(jQuery);
    }
  });

  // ../islamic_calendar/islamic_calendar/public/js/islamic_assets.bundle.js
  var import_jquery_plugin = __toESM(require_jquery_plugin());

  // ../islamic_calendar/islamic_calendar/public/islamic_lib/jquery.calendars.js
  (function($2) {
    "use strict";
    function Calendars() {
      this.regionalOptions = [];
      this.regionalOptions[""] = {
        invalidCalendar: "Calendar {0} not found",
        invalidDate: "Invalid {0} date",
        invalidMonth: "Invalid {0} month",
        invalidYear: "Invalid {0} year",
        differentCalendars: "Cannot mix {0} and {1} dates"
      };
      this.local = this.regionalOptions[""];
      this.calendars = {};
      this._localCals = {};
    }
    $2.extend(Calendars.prototype, {
      instance: function(name, language) {
        name = (name || "gregorian").toLowerCase();
        language = language || "";
        var cal = this._localCals[name + "-" + language];
        if (!cal && this.calendars[name]) {
          cal = new this.calendars[name](language);
          this._localCals[name + "-" + language] = cal;
        }
        if (!cal) {
          throw (this.local.invalidCalendar || this.regionalOptions[""].invalidCalendar).replace(/\{0\}/, name);
        }
        return cal;
      },
      newDate: function(year, month, day, calendar, language) {
        calendar = (typeof year !== "undefined" && year !== null && year.year ? year.calendar() : typeof calendar === "string" ? this.instance(calendar, language) : calendar) || this.instance();
        return calendar.newDate(year, month, day);
      },
      substituteDigits: function(digits) {
        return function(value2) {
          return (value2 + "").replace(/[0-9]/g, function(digit) {
            return digits[digit];
          });
        };
      },
      substituteChineseDigits: function(digits, powers) {
        return function(value2) {
          var localNumber = "";
          var power = 0;
          while (value2 > 0) {
            var units = value2 % 10;
            localNumber = (units === 0 ? "" : digits[units] + powers[power]) + localNumber;
            power++;
            value2 = Math.floor(value2 / 10);
          }
          if (localNumber.indexOf(digits[1] + powers[1]) === 0) {
            localNumber = localNumber.substr(1);
          }
          return localNumber || digits[0];
        };
      }
    });
    function CDate(calendar, year, month, day) {
      this._calendar = calendar;
      this._year = year;
      this._month = month;
      this._day = day;
      if (this._calendar._validateLevel === 0 && !this._calendar.isValid(this._year, this._month, this._day)) {
        throw ($2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate).replace(/\{0\}/, this._calendar.local.name);
      }
    }
    function pad(value2, length) {
      value2 = "" + value2;
      return "000000".substring(0, length - value2.length) + value2;
    }
    $2.extend(CDate.prototype, {
      newDate: function(year, month, day) {
        return this._calendar.newDate(typeof year === "undefined" || year === null ? this : year, month, day);
      },
      year: function(year) {
        return arguments.length === 0 ? this._year : this.set(year, "y");
      },
      month: function(month) {
        return arguments.length === 0 ? this._month : this.set(month, "m");
      },
      day: function(day) {
        return arguments.length === 0 ? this._day : this.set(day, "d");
      },
      date: function(year, month, day) {
        if (!this._calendar.isValid(year, month, day)) {
          throw ($2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate).replace(/\{0\}/, this._calendar.local.name);
        }
        this._year = year;
        this._month = month;
        this._day = day;
        return this;
      },
      leapYear: function() {
        return this._calendar.leapYear(this);
      },
      epoch: function() {
        return this._calendar.epoch(this);
      },
      formatYear: function() {
        return this._calendar.formatYear(this);
      },
      monthOfYear: function() {
        return this._calendar.monthOfYear(this);
      },
      weekOfYear: function() {
        return this._calendar.weekOfYear(this);
      },
      daysInYear: function() {
        return this._calendar.daysInYear(this);
      },
      dayOfYear: function() {
        return this._calendar.dayOfYear(this);
      },
      daysInMonth: function() {
        return this._calendar.daysInMonth(this);
      },
      dayOfWeek: function() {
        return this._calendar.dayOfWeek(this);
      },
      weekDay: function() {
        return this._calendar.weekDay(this);
      },
      extraInfo: function() {
        return this._calendar.extraInfo(this);
      },
      add: function(offset, period) {
        return this._calendar.add(this, offset, period);
      },
      set: function(value2, period) {
        return this._calendar.set(this, value2, period);
      },
      compareTo: function(date) {
        if (this._calendar.name !== date._calendar.name) {
          throw ($2.calendars.local.differentCalendars || $2.calendars.regionalOptions[""].differentCalendars).replace(/\{0\}/, this._calendar.local.name).replace(/\{1\}/, date._calendar.local.name);
        }
        var c = this._year !== date._year ? this._year - date._year : this._month !== date._month ? this.monthOfYear() - date.monthOfYear() : this._day - date._day;
        return c === 0 ? 0 : c < 0 ? -1 : 1;
      },
      calendar: function() {
        return this._calendar;
      },
      toJD: function() {
        return this._calendar.toJD(this);
      },
      fromJD: function(jd) {
        return this._calendar.fromJD(jd);
      },
      toJSDate: function() {
        return this._calendar.toJSDate(this);
      },
      fromJSDate: function(jsd) {
        return this._calendar.fromJSDate(jsd);
      },
      toString: function() {
        return (this.year() < 0 ? "-" : "") + pad(Math.abs(this.year()), 4) + "-" + pad(this.month(), 2) + "-" + pad(this.day(), 2);
      }
    });
    function BaseCalendar() {
      this.shortYearCutoff = "+10";
    }
    $2.extend(BaseCalendar.prototype, {
      _validateLevel: 0,
      newDate: function(year, month, day) {
        if (typeof year === "undefined" || year === null) {
          return this.today();
        }
        if (year.year) {
          this._validate(
            year,
            month,
            day,
            $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
          );
          day = year.day();
          month = year.month();
          year = year.year();
        }
        return new CDate(this, year, month, day);
      },
      today: function() {
        return this.fromJSDate(new Date());
      },
      epoch: function(year) {
        var date = this._validate(
          year,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidYear || $2.calendars.regionalOptions[""].invalidYear
        );
        return date.year() < 0 ? this.local.epochs[0] : this.local.epochs[1];
      },
      formatYear: function(year) {
        var date = this._validate(
          year,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidYear || $2.calendars.regionalOptions[""].invalidYear
        );
        return (date.year() < 0 ? "-" : "") + pad(Math.abs(date.year()), 4);
      },
      monthsInYear: function(year) {
        this._validate(
          year,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidYear || $2.calendars.regionalOptions[""].invalidYear
        );
        return 12;
      },
      monthOfYear: function(year, month) {
        var date = this._validate(
          year,
          month,
          this.minDay,
          $2.calendars.local.invalidMonth || $2.calendars.regionalOptions[""].invalidMonth
        );
        return (date.month() + this.monthsInYear(date) - this.firstMonth) % this.monthsInYear(date) + this.minMonth;
      },
      fromMonthOfYear: function(year, ord) {
        var m = (ord + this.firstMonth - 2 * this.minMonth) % this.monthsInYear(year) + this.minMonth;
        this._validate(
          year,
          m,
          this.minDay,
          $2.calendars.local.invalidMonth || $2.calendars.regionalOptions[""].invalidMonth
        );
        return m;
      },
      daysInYear: function(year) {
        var date = this._validate(
          year,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidYear || $2.calendars.regionalOptions[""].invalidYear
        );
        return this.leapYear(date) ? 366 : 365;
      },
      dayOfYear: function(year, month, day) {
        var date = this._validate(
          year,
          month,
          day,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        return date.toJD() - this.newDate(
          date.year(),
          this.fromMonthOfYear(date.year(), this.minMonth),
          this.minDay
        ).toJD() + 1;
      },
      daysInWeek: function() {
        return 7;
      },
      dayOfWeek: function(year, month, day) {
        var date = this._validate(
          year,
          month,
          day,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        return (Math.floor(this.toJD(date)) + 2) % this.daysInWeek();
      },
      extraInfo: function(year, month, day) {
        this._validate(
          year,
          month,
          day,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        return {};
      },
      add: function(date, offset, period) {
        this._validate(
          date,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        return this._correctAdd(date, this._add(date, offset, period), offset, period);
      },
      _add: function(date, offset, period) {
        this._validateLevel++;
        var d;
        if (period === "d" || period === "w") {
          var jd = date.toJD() + offset * (period === "w" ? this.daysInWeek() : 1);
          d = date.calendar().fromJD(jd);
          this._validateLevel--;
          return [d.year(), d.month(), d.day()];
        }
        try {
          var y = date.year() + (period === "y" ? offset : 0);
          var m = date.monthOfYear() + (period === "m" ? offset : 0);
          d = date.day();
          var resyncYearMonth = function(calendar) {
            while (m < calendar.minMonth) {
              y--;
              m += calendar.monthsInYear(y);
            }
            var yearMonths = calendar.monthsInYear(y);
            while (m > yearMonths - 1 + calendar.minMonth) {
              y++;
              m -= yearMonths;
              yearMonths = calendar.monthsInYear(y);
            }
          };
          if (period === "y") {
            if (date.month() !== this.fromMonthOfYear(y, m)) {
              m = this.newDate(y, date.month(), this.minDay).monthOfYear();
            }
            m = Math.min(m, this.monthsInYear(y));
            d = Math.min(d, this.daysInMonth(y, this.fromMonthOfYear(y, m)));
          } else if (period === "m") {
            resyncYearMonth(this);
            d = Math.min(d, this.daysInMonth(y, this.fromMonthOfYear(y, m)));
          }
          var ymd = [y, this.fromMonthOfYear(y, m), d];
          this._validateLevel--;
          return ymd;
        } catch (e) {
          this._validateLevel--;
          throw e;
        }
      },
      _correctAdd: function(date, ymd, offset, period) {
        if (!this.hasYearZero && (period === "y" || period === "m")) {
          if (ymd[0] === 0 || date.year() > 0 !== ymd[0] > 0) {
            var adj = {
              y: [1, 1, "y"],
              m: [1, this.monthsInYear(-1), "m"],
              w: [this.daysInWeek(), this.daysInYear(-1), "d"],
              d: [1, this.daysInYear(-1), "d"]
            }[period];
            var dir = offset < 0 ? -1 : 1;
            ymd = this._add(date, offset * adj[0] + dir * adj[1], adj[2]);
          }
        }
        return date.date(ymd[0], ymd[1], ymd[2]);
      },
      set: function(date, value2, period) {
        this._validate(
          date,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        var y = period === "y" ? value2 : date.year();
        var m = period === "m" ? value2 : date.month();
        var d = period === "d" ? value2 : date.day();
        if (period === "y" || period === "m") {
          d = Math.min(d, this.daysInMonth(y, m));
        }
        return date.date(y, m, d);
      },
      isValid: function(year, month, day) {
        this._validateLevel++;
        var valid = this.hasYearZero || year !== 0;
        if (valid) {
          var date = this.newDate(year, month, this.minDay);
          valid = month >= this.minMonth && month - this.minMonth < this.monthsInYear(date) && (day >= this.minDay && day - this.minDay < this.daysInMonth(date));
        }
        this._validateLevel--;
        return valid;
      },
      toJSDate: function(year, month, day) {
        var date = this._validate(
          year,
          month,
          day,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        return $2.calendars.instance().fromJD(this.toJD(date)).toJSDate();
      },
      fromJSDate: function(jsd) {
        return this.fromJD($2.calendars.instance().fromJSDate(jsd).toJD());
      },
      _validate: function(year, month, day, error) {
        if (year.year) {
          if (this._validateLevel === 0 && this.name !== year.calendar().name) {
            throw ($2.calendars.local.differentCalendars || $2.calendars.regionalOptions[""].differentCalendars).replace(/\{0\}/, this.local.name).replace(/\{1\}/, year.calendar().local.name);
          }
          return year;
        }
        try {
          this._validateLevel++;
          if (this._validateLevel === 1 && !this.isValid(year, month, day)) {
            throw error.replace(/\{0\}/, this.local.name);
          }
          var date = this.newDate(year, month, day);
          this._validateLevel--;
          return date;
        } catch (e) {
          this._validateLevel--;
          throw e;
        }
      }
    });
    function GregorianCalendar(language) {
      this.local = this.regionalOptions[language] || this.regionalOptions[""];
    }
    GregorianCalendar.prototype = new BaseCalendar();
    $2.extend(GregorianCalendar.prototype, {
      name: "Gregorian",
      jdEpoch: 17214255e-1,
      daysPerMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      hasYearZero: false,
      minMonth: 1,
      firstMonth: 1,
      minDay: 1,
      regionalOptions: {
        "": {
          name: "Gregorian",
          epochs: ["BCE", "CE"],
          monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          digits: null,
          dateFormat: "mm/dd/yyyy",
          firstDay: 0,
          isRTL: false
        }
      },
      leapYear: function(year) {
        var date = this._validate(
          year,
          this.minMonth,
          this.minDay,
          $2.calendars.local.invalidYear || $2.calendars.regionalOptions[""].invalidYear
        );
        year = date.year() + (date.year() < 0 ? 1 : 0);
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      },
      weekOfYear: function(year, month, day) {
        var checkDate = this.newDate(year, month, day);
        checkDate.add(4 - (checkDate.dayOfWeek() || 7), "d");
        return Math.floor((checkDate.dayOfYear() - 1) / 7) + 1;
      },
      daysInMonth: function(year, month) {
        var date = this._validate(
          year,
          month,
          this.minDay,
          $2.calendars.local.invalidMonth || $2.calendars.regionalOptions[""].invalidMonth
        );
        return this.daysPerMonth[date.month() - 1] + (date.month() === 2 && this.leapYear(date.year()) ? 1 : 0);
      },
      weekDay: function(year, month, day) {
        return (this.dayOfWeek(year, month, day) || 7) < 6;
      },
      toJD: function(year, month, day) {
        var date = this._validate(
          year,
          month,
          day,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        year = date.year();
        month = date.month();
        day = date.day();
        if (year < 0) {
          year++;
        }
        if (month < 3) {
          month += 12;
          year--;
        }
        var a = Math.floor(year / 100);
        var b = 2 - a + Math.floor(a / 4);
        return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
      },
      fromJD: function(jd) {
        var z = Math.floor(jd + 0.5);
        var a = Math.floor((z - 186721625e-2) / 36524.25);
        a = z + 1 + a - Math.floor(a / 4);
        var b = a + 1524;
        var c = Math.floor((b - 122.1) / 365.25);
        var d = Math.floor(365.25 * c);
        var e = Math.floor((b - d) / 30.6001);
        var day = b - d - Math.floor(e * 30.6001);
        var month = e - (e > 13.5 ? 13 : 1);
        var year = c - (month > 2.5 ? 4716 : 4715);
        if (year <= 0) {
          year--;
        }
        return this.newDate(year, month, day);
      },
      toJSDate: function(year, month, day) {
        var date = this._validate(
          year,
          month,
          day,
          $2.calendars.local.invalidDate || $2.calendars.regionalOptions[""].invalidDate
        );
        var jsd = new Date(date.year(), date.month() - 1, date.day());
        jsd.setHours(0);
        jsd.setMinutes(0);
        jsd.setSeconds(0);
        jsd.setMilliseconds(0);
        jsd.setHours(jsd.getHours() > 12 ? jsd.getHours() + 2 : 0);
        return jsd;
      },
      fromJSDate: function(jsd) {
        return this.newDate(jsd.getFullYear(), jsd.getMonth() + 1, jsd.getDate());
      }
    });
    $2.calendars = new Calendars();
    $2.calendars.cdate = CDate;
    $2.calendars.baseCalendar = BaseCalendar;
    $2.calendars.calendars.gregorian = GregorianCalendar;
  })(jQuery);

  // ../islamic_calendar/islamic_calendar/public/islamic_lib/jquery.calendars.iranian.js
  (function($2) {
    "use strict";
    function IranianCalendar(language) {
      this.local = this.regionalOptions[language || ""] || this.regionalOptions[""];
    }
    IranianCalendar.prototype = new $2.calendars.baseCalendar();
    $2.extend(IranianCalendar.prototype, {
      name: "Iranian",
      jdEpoch: 19483205e-1,
      daysPerMonth: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
      hasYearZero: false,
      minMonth: 1,
      firstMonth: 1,
      minDay: 1,
      regionalOptions: {
        "": {
          name: "Iranian",
          epochs: ["BSH", "SH"],
          monthNames: ["\u062D\u0645\u0644", "\u062B\u0648\u0631", "\u062C\u0648\u0632\u0627", "\u0633\u0631\u0637\u0627\u0646", "\u0627\u0633\u062F", "\u0633\u0646\u0628\u0644\u0647", "\u0645\u06CC\u0632\u0627\u0646", "\u0639\u0642\u0631\u0628", "\u0642\u0648\u0633", "\u062C\u062F\u06CC", "\u062F\u0644\u0648", "\u062D\u0648\u062A"],
          monthNamesShort: ["\u062D\u0645\u0644", "\u062B\u0648\u0631", "\u062C\u0648\u0632\u0627", "\u0633\u0631\u0637\u0627\u0646", "\u0627\u0633\u062F", "\u0633\u0646\u0628\u0644\u0647", "\u0645\u06CC\u0632\u0627\u0646", "\u0639\u0642\u0631\u0628", "\u0642\u0648\u0633", "\u062C\u062F\u06CC", "\u062F\u0644\u0648", "\u062D\u0648\u062A"],
          dayNames: ["\u064A\u06A9\u0634\u0646\u0628\u0647", "\u062F\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u200C\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067E\u0646\u062C\u0634\u0646\u0628\u0647", "\u062C\u0645\u0639\u0647", "\u0634\u0646\u0628\u0647"],
          dayNamesShort: ["\u06CC", "\u062F", "\u0633", "\u0686", "\u067E", "\u062C", "\u0634"],
          dayNamesMin: ["\u06CC", "\u062F", "\u0633", "\u0686", "\u067E", "\u062C", "\u0634"],
          digits: null,
          dateFormat: "yyyy/mm/dd",
          firstDay: 6,
          isRTL: false
        }
      },
      leapYear: function(year) {
        var date = this._validate(year, this.minMonth, this.minDay, $2.calendars.local.invalidYear);
        return this._yearInfo(date.year()).leap === 0;
      },
      weekOfYear: function(year, month, day) {
        var checkDate = this.newDate(year, month, day);
        checkDate.add(-((checkDate.dayOfWeek() + 1) % 7), "d");
        return Math.floor((checkDate.dayOfYear() - 1) / 7) + 1;
      },
      daysInMonth: function(year, month) {
        var date = this._validate(year, month, this.minDay, $2.calendars.local.invalidMonth);
        return this.daysPerMonth[date.month() - 1] + (date.month() === 12 && this.leapYear(date.year()) ? 1 : 0);
      },
      weekDay: function(year, month, day) {
        return this.dayOfWeek(year, month, day) !== 5;
      },
      toJD: function(year, month, day) {
        var date = this._validate(year, month, day, $2.calendars.local.invalidDate);
        var info = this._yearInfo(date.year());
        return this._g2d(info.gy, 3, info.march) + 31 * (date.month() - 1) - div(date.month(), 7) * (date.month() - 7) + date.day() - 1;
      },
      fromJD: function(jd) {
        var day, month;
        var gy = this._d2gy(jd);
        var year = gy - 621;
        if (year <= 0) {
          year--;
        }
        var info = this._yearInfo(year);
        var diff = jd - this._g2d(gy, 3, info.march);
        if (diff >= 0) {
          if (diff <= 185) {
            month = div(diff, 31) + 1;
            day = mod(diff, 31) + 1;
            return this.newDate(year, month, day);
          }
          diff -= 186;
        } else {
          year--;
          if (year === 0) {
            year--;
          }
          diff += 179;
          if (info.leap === 1) {
            diff++;
          }
        }
        month = div(diff, 30) + 7;
        day = mod(diff, 30) + 1;
        return this.newDate(year, month, day);
      },
      isValid: function(year, month, day) {
        var valid = $2.calendars.baseCalendar.prototype.isValid.apply(this, arguments);
        if (valid) {
          year = typeof year.year === "function" ? year.year() : year;
          valid = year >= special[0] && year < special[last];
        }
        return valid;
      },
      _validate: function(year, month, day, error) {
        var date = $2.calendars.baseCalendar.prototype._validate.apply(this, arguments);
        if (date.year() < special[0] || date.year() >= special[last]) {
          throw error.replace(/\{0\}/, this.local.name);
        }
        return date;
      },
      _d2gy: function(jd) {
        var i = 4 * (jd + 0.5) + 139361631 + 4 * div(3 * div(4 * (jd + 0.5) + 183187720, 146097), 4) - 3908;
        var j = 5 * div(mod(i, 1461), 4) + 308;
        var gm = mod(div(j, 153), 12) + 1;
        return div(i, 1461) - 100100 + div(8 - gm, 6);
      },
      _g2d: function(year, month, day) {
        var i = div(1461 * (year + div(month - 8, 6) + 100100), 4) + div(153 * mod(month + 9, 12) + 2, 5) + day - 34840408;
        return i - div(3 * div(year + 100100 + div(month - 8, 6), 100), 4) + 752 - 0.5;
      },
      _yearInfo: function(year) {
        year = year.year ? year.year() : year;
        var specDiff;
        if (year < 0) {
          year++;
        }
        var gy = year + 621;
        var m = -14;
        var prevSpec = special[0];
        for (var i = 1; i <= last && (specDiff = special[i] - prevSpec, special[i] <= year); i++) {
          m += 8 * div(specDiff, 33) + div(mod(specDiff, 33), 4);
          prevSpec = special[i];
        }
        var offset = year - prevSpec;
        m += 8 * div(offset, 33) + div(mod(offset, 33) + 3, 4);
        if (mod(specDiff, 33) === 4 && specDiff - offset === 4) {
          m++;
        }
        var r = div(gy, 4) - div(3 * (div(gy, 100) + 1), 4) - 150;
        var march = 20 + m - r;
        if (specDiff - offset < 6) {
          offset = offset - specDiff + 33 * div(specDiff + 4, 33);
        }
        var leap = mod(mod(offset + 1, 33) - 1, 4);
        leap = leap === -1 ? 4 : leap;
        return { gy, leap, march };
      }
    });
    function div(a, b) {
      return ~~(a / b);
    }
    function mod(a, b) {
      return a - ~~(a / b) * b;
    }
    var special = [
      -61,
      9,
      38,
      199,
      426,
      686,
      756,
      818,
      1111,
      1181,
      1210,
      1635,
      2060,
      2097,
      2192,
      2262,
      2324,
      2394,
      2456,
      3178
    ];
    var last = special.length - 1;
    $2.calendars.calendars.iranian = IranianCalendar;
  })(jQuery);

  // ../islamic_calendar/islamic_calendar/public/islamic_lib/jquery.calendars.plus.js
  (function($2) {
    "use strict";
    $2.extend($2.calendars.regionalOptions[""], {
      invalidArguments: "Invalid arguments",
      invalidFormat: "Cannot format a date from another calendar",
      missingNumberAt: "Missing number at position {0}",
      unknownNameAt: "Unknown name at position {0}",
      unexpectedLiteralAt: "Unexpected literal at position {0}",
      unexpectedText: "Additional text found at end"
    });
    $2.calendars.local = $2.calendars.regionalOptions[""];
    $2.extend($2.calendars.cdate.prototype, {
      formatDate: function(format, settings) {
        if (typeof format !== "string") {
          settings = format;
          format = "";
        }
        return this._calendar.formatDate(format || "", this, settings);
      }
    });
    $2.extend($2.calendars.baseCalendar.prototype, {
      UNIX_EPOCH: $2.calendars.instance().newDate(1970, 1, 1).toJD(),
      SECS_PER_DAY: 24 * 60 * 60,
      TICKS_EPOCH: $2.calendars.instance().jdEpoch,
      TICKS_PER_DAY: 24 * 60 * 60 * 1e7,
      ATOM: "yyyy-mm-dd",
      COOKIE: "D, dd M yyyy",
      FULL: "DD, MM d, yyyy",
      ISO_8601: "yyyy-mm-dd",
      JULIAN: "J",
      RFC_822: "D, d M yy",
      RFC_850: "DD, dd-M-yy",
      RFC_1036: "D, d M yy",
      RFC_1123: "D, d M yyyy",
      RFC_2822: "D, d M yyyy",
      RSS: "D, d M yy",
      TICKS: "!",
      TIMESTAMP: "@",
      W3C: "yyyy-mm-dd",
      formatDate: function(format, date, settings) {
        if (typeof format !== "string") {
          settings = date;
          date = format;
          format = "";
        }
        if (!date) {
          return "";
        }
        if (date.calendar() !== this) {
          throw $2.calendars.local.invalidFormat || $2.calendars.regionalOptions[""].invalidFormat;
        }
        format = format || this.local.dateFormat;
        settings = settings || {};
        var dayNamesShort = settings.dayNamesShort || this.local.dayNamesShort;
        var dayNames = settings.dayNames || this.local.dayNames;
        var monthNamesShort = settings.monthNamesShort || this.local.monthNamesShort;
        var monthNames = settings.monthNames || this.local.monthNames;
        var localNumbers = settings.localNumbers || this.local.localNumbers;
        var doubled = function(match, step) {
          var matches = 1;
          while (iFormat + matches < format.length && format.charAt(iFormat + matches) === match) {
            matches++;
          }
          iFormat += matches - 1;
          return Math.floor(matches / (step || 1)) > 1;
        };
        var formatNumber = function(match, value2, len, step) {
          var num = "" + value2;
          if (doubled(match, step)) {
            while (num.length < len) {
              num = "0" + num;
            }
          }
          return num;
        };
        var formatName = function(match, value2, shortNames, longNames) {
          return doubled(match) ? longNames[value2] : shortNames[value2];
        };
        var localiseNumbers = localNumbers && this.local.digits ? this.local.digits : function(value2) {
          return value2;
        };
        var output = "";
        var literal = false;
        for (var iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !doubled("'")) {
              literal = false;
            } else {
              output += format.charAt(iFormat);
            }
          } else {
            switch (format.charAt(iFormat)) {
              case "d":
                output += localiseNumbers(formatNumber("d", date.day(), 2));
                break;
              case "D":
                output += formatName("D", date.dayOfWeek(), dayNamesShort, dayNames);
                break;
              case "o":
                output += formatNumber("o", date.dayOfYear(), 3);
                break;
              case "w":
                output += formatNumber("w", date.weekOfYear(), 2);
                break;
              case "m":
                output += localiseNumbers(formatNumber("m", date.month(), 2));
                break;
              case "M":
                output += formatName("M", date.month() - this.minMonth, monthNamesShort, monthNames);
                break;
              case "y":
                output += localiseNumbers(doubled("y", 2) ? date.year() : (date.year() % 100 < 10 ? "0" : "") + date.year() % 100);
                break;
              case "Y":
                doubled("Y", 2);
                output += date.formatYear();
                break;
              case "J":
                output += date.toJD();
                break;
              case "@":
                output += (date.toJD() - this.UNIX_EPOCH) * this.SECS_PER_DAY;
                break;
              case "!":
                output += (date.toJD() - this.TICKS_EPOCH) * this.TICKS_PER_DAY;
                break;
              case "'":
                if (doubled("'")) {
                  output += "'";
                } else {
                  literal = true;
                }
                break;
              default:
                output += format.charAt(iFormat);
            }
          }
        }
        return output;
      },
      parseDate: function(format, value2, settings) {
        if (typeof value2 === "undefined" || value2 === null) {
          throw $2.calendars.local.invalidArguments || $2.calendars.regionalOptions[""].invalidArguments;
        }
        value2 = typeof value2 === "object" ? value2.toString() : value2 + "";
        if (value2 === "") {
          return null;
        }
        format = format || this.local.dateFormat;
        settings = settings || {};
        var shortYearCutoff = settings.shortYearCutoff || this.shortYearCutoff;
        shortYearCutoff = typeof shortYearCutoff !== "string" ? shortYearCutoff : this.today().year() % 100 + parseInt(shortYearCutoff, 10);
        var dayNamesShort = settings.dayNamesShort || this.local.dayNamesShort;
        var dayNames = settings.dayNames || this.local.dayNames;
        var monthNamesShort = settings.monthNamesShort || this.local.monthNamesShort;
        var monthNames = settings.monthNames || this.local.monthNames;
        var jd = NaN;
        var year = NaN;
        var month = NaN;
        var day = NaN;
        var doy = NaN;
        var shortYear = false;
        var literal = false;
        var doubled = function(match, step) {
          var matches = 1;
          while (iFormat + matches < format.length && format.charAt(iFormat + matches) === match) {
            matches++;
          }
          iFormat += matches - 1;
          return Math.floor(matches / (step || 1)) > 1;
        };
        var getNumber = function(match, step) {
          var isDoubled = doubled(match, step);
          var size = [2, 3, isDoubled ? 4 : 2, isDoubled ? 4 : 2, 10, 11, 20]["oyYJ@!".indexOf(match) + 1];
          var digits = new RegExp("^-?\\d{1," + size + "}");
          var num = value2.substring(iValue).match(digits);
          if (!num) {
            throw ($2.calendars.local.missingNumberAt || $2.calendars.regionalOptions[""].missingNumberAt).replace(/\{0\}/, iValue);
          }
          iValue += num[0].length;
          return parseInt(num[0], 10);
        };
        var calendar = this;
        var getName = function(match, shortNames, longNames, step) {
          var names = doubled(match, step) ? longNames : shortNames;
          var index = -1;
          for (var i = 0; i < names.length; i++) {
            if (value2.substr(iValue, names[i].length).toLowerCase() === names[i].toLowerCase()) {
              if (index === -1) {
                index = i;
              } else if (names[i].length > names[index].length) {
                index = i;
              }
            }
          }
          if (index > -1) {
            iValue += names[index].length;
            return index + calendar.minMonth;
          }
          throw ($2.calendars.local.unknownNameAt || $2.calendars.regionalOptions[""].unknownNameAt).replace(/\{0\}/, iValue);
        };
        var checkLiteral = function() {
          if (value2.charAt(iValue) !== format.charAt(iFormat)) {
            throw ($2.calendars.local.unexpectedLiteralAt || $2.calendars.regionalOptions[""].unexpectedLiteralAt).replace(/\{0\}/, iValue);
          }
          iValue++;
        };
        var iValue = 0;
        for (var iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !doubled("'")) {
              literal = false;
            } else {
              checkLiteral();
            }
          } else {
            switch (format.charAt(iFormat)) {
              case "d":
                day = getNumber("d");
                break;
              case "D":
                getName("D", dayNamesShort, dayNames);
                break;
              case "o":
                doy = getNumber("o");
                break;
              case "w":
                getNumber("w");
                break;
              case "m":
                month = getNumber("m");
                break;
              case "M":
                month = getName("M", monthNamesShort, monthNames);
                break;
              case "y":
                var iSave = iFormat;
                shortYear = !doubled("y", 2);
                iFormat = iSave;
                year = getNumber("y", 2);
                break;
              case "Y":
                year = getNumber("Y", 2);
                break;
              case "J":
                jd = getNumber("J") + 0.5;
                if (value2.charAt(iValue) === ".") {
                  iValue++;
                  getNumber("J");
                }
                break;
              case "@":
                jd = getNumber("@") / this.SECS_PER_DAY + this.UNIX_EPOCH;
                break;
              case "!":
                jd = getNumber("!") / this.TICKS_PER_DAY + this.TICKS_EPOCH;
                break;
              case "*":
                iValue = value2.length;
                break;
              case "'":
                if (doubled("'")) {
                  checkLiteral();
                } else {
                  literal = true;
                }
                break;
              default:
                checkLiteral();
            }
          }
        }
        if (iValue < value2.length) {
          throw $2.calendars.local.unexpectedText || $2.calendars.regionalOptions[""].unexpectedText;
        }
        if (isNaN(year)) {
          year = this.today().year();
        } else if (year < 100 && shortYear) {
          year += shortYearCutoff === -1 ? 1900 : this.today().year() - this.today().year() % 100 - (year <= shortYearCutoff ? 0 : 100);
        }
        if (!isNaN(doy)) {
          month = 1;
          day = doy;
          for (var dim = this.daysInMonth(year, month); day > dim; dim = this.daysInMonth(year, month)) {
            month++;
            day -= dim;
          }
        }
        return !isNaN(jd) ? this.fromJD(jd) : this.newDate(year, month, day);
      },
      determineDate: function(dateSpec, defaultDate, currentDate, dateFormat, settings) {
        if (currentDate && typeof currentDate !== "object") {
          settings = dateFormat;
          dateFormat = currentDate;
          currentDate = null;
        }
        if (typeof dateFormat !== "string") {
          settings = dateFormat;
          dateFormat = "";
        }
        var calendar = this;
        var offsetString = function(offset) {
          try {
            return calendar.parseDate(dateFormat, offset, settings);
          } catch (e) {
          }
          offset = offset.toLowerCase();
          var date = (offset.match(/^c/) && currentDate ? currentDate.newDate() : null) || calendar.today();
          var pattern = /([+-]?[0-9]+)\s*(d|w|m|y)?/g;
          var matches = pattern.exec(offset);
          while (matches) {
            date.add(parseInt(matches[1], 10), matches[2] || "d");
            matches = pattern.exec(offset);
          }
          return date;
        };
        defaultDate = defaultDate ? defaultDate.newDate() : null;
        dateSpec = typeof dateSpec === "undefined" || dateSpec === null ? defaultDate : typeof dateSpec === "string" ? offsetString(dateSpec) : typeof dateSpec === "number" ? isNaN(dateSpec) || dateSpec === Infinity || dateSpec === -Infinity ? defaultDate : calendar.today().add(dateSpec, "d") : calendar.newDate(dateSpec);
        return dateSpec;
      }
    });
  })(jQuery);

  // ../islamic_calendar/islamic_calendar/public/islamic_lib/jquery.calendars.picker.js
  (function($2) {
    "use strict";
    var pluginName = "calendarsPicker";
    $2.JQPlugin.createPlugin({
      name: pluginName,
      defaultRenderer: {
        picker: '<div class="calendars"><div class="calendars-nav">{link:prev}{link:today}{link:next}</div>{months}{popup:start}<div class="calendars-ctrl">{link:clear}{link:close}</div>{popup:end}<div class="calendars-clear-fix"></div></div>',
        monthRow: '<div class="calendars-month-row">{months}</div>',
        month: '<div class="calendars-month"><div class="calendars-month-header">{monthHeader}</div><table><thead>{weekHeader}</thead><tbody>{weeks}</tbody></table></div>',
        weekHeader: "<tr>{days}</tr>",
        dayHeader: "<th>{day}</th>",
        week: "<tr>{days}</tr>",
        day: "<td>{day}</td>",
        monthSelector: ".calendars-month",
        daySelector: "td",
        rtlClass: "calendars-rtl",
        multiClass: "calendars-multi",
        defaultClass: "",
        selectedClass: "calendars-selected",
        highlightedClass: "calendars-highlight",
        todayClass: "calendars-today",
        otherMonthClass: "calendars-other-month",
        weekendClass: "calendars-weekend",
        commandClass: "calendars-cmd",
        commandButtonClass: "",
        commandLinkClass: "",
        disabledClass: "calendars-disabled"
      },
      commands: {
        prev: {
          text: "prevText",
          status: "prevStatus",
          keystroke: { keyCode: 33 },
          enabled: function(inst) {
            var minDate = inst.curMinDate();
            return !minDate || inst.drawDate.newDate().add(1 - inst.options.monthsToStep - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay).add(-1, "d").compareTo(minDate) !== -1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(-inst.options.monthsToStep - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay);
          },
          action: function(inst) {
            plugin.changeMonth(this, -inst.options.monthsToStep);
          }
        },
        prevJump: {
          text: "prevJumpText",
          status: "prevJumpStatus",
          keystroke: { keyCode: 33, ctrlKey: true },
          enabled: function(inst) {
            var minDate = inst.curMinDate();
            return !minDate || inst.drawDate.newDate().add(1 - inst.options.monthsToJump - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay).add(-1, "d").compareTo(minDate) !== -1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(-inst.options.monthsToJump - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay);
          },
          action: function(inst) {
            plugin.changeMonth(this, -inst.options.monthsToJump);
          }
        },
        next: {
          text: "nextText",
          status: "nextStatus",
          keystroke: { keyCode: 34 },
          enabled: function(inst) {
            var maxDate = inst.get("maxDate");
            return !maxDate || inst.drawDate.newDate().add(inst.options.monthsToStep - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay).compareTo(maxDate) !== 1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(inst.options.monthsToStep - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay);
          },
          action: function(inst) {
            plugin.changeMonth(this, inst.options.monthsToStep);
          }
        },
        nextJump: {
          text: "nextJumpText",
          status: "nextJumpStatus",
          keystroke: { keyCode: 34, ctrlKey: true },
          enabled: function(inst) {
            var maxDate = inst.get("maxDate");
            return !maxDate || inst.drawDate.newDate().add(inst.options.monthsToJump - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay).compareTo(maxDate) !== 1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(inst.options.monthsToJump - inst.options.monthsOffset, "m").day(inst.options.calendar.minDay);
          },
          action: function(inst) {
            plugin.changeMonth(this, inst.options.monthsToJump);
          }
        },
        current: {
          text: "currentText",
          status: "currentStatus",
          keystroke: { keyCode: 36, ctrlKey: true },
          enabled: function(inst) {
            var minDate = inst.curMinDate();
            var maxDate = inst.get("maxDate");
            var curDate = inst.selectedDates[0] || inst.options.calendar.today();
            return (!minDate || curDate.compareTo(minDate) !== -1) && (!maxDate || curDate.compareTo(maxDate) !== 1);
          },
          date: function(inst) {
            return inst.selectedDates[0] || inst.options.calendar.today();
          },
          action: function(inst) {
            var curDate = inst.selectedDates[0] || inst.options.calendar.today();
            plugin.showMonth(this, curDate.year(), curDate.month());
          }
        },
        today: {
          text: "todayText",
          status: "todayStatus",
          keystroke: { keyCode: 36, ctrlKey: true },
          enabled: function(inst) {
            var minDate = inst.curMinDate();
            var maxDate = inst.get("maxDate");
            return (!minDate || inst.options.calendar.today().compareTo(minDate) !== -1) && (!maxDate || inst.options.calendar.today().compareTo(maxDate) !== 1);
          },
          date: function(inst) {
            return inst.options.calendar.today();
          },
          action: function() {
            plugin.showMonth(this);
          }
        },
        clear: {
          text: "clearText",
          status: "clearStatus",
          keystroke: { keyCode: 35, ctrlKey: true },
          enabled: function() {
            return true;
          },
          date: function() {
            return null;
          },
          action: function() {
            plugin.clear(this);
          }
        },
        close: {
          text: "closeText",
          status: "closeStatus",
          keystroke: { keyCode: 27 },
          enabled: function() {
            return true;
          },
          date: function() {
            return null;
          },
          action: function() {
            plugin.hide(this);
          }
        },
        prevWeek: {
          text: "prevWeekText",
          status: "prevWeekStatus",
          keystroke: { keyCode: 38, ctrlKey: true },
          enabled: function(inst) {
            var minDate = inst.curMinDate();
            return !minDate || inst.drawDate.newDate().add(-inst.options.calendar.daysInWeek(), "d").compareTo(minDate) !== -1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(-inst.options.calendar.daysInWeek(), "d");
          },
          action: function(inst) {
            plugin.changeDay(this, -inst.options.calendar.daysInWeek());
          }
        },
        prevDay: {
          text: "prevDayText",
          status: "prevDayStatus",
          keystroke: { keyCode: 37, ctrlKey: true },
          enabled: function(inst) {
            var minDate = inst.curMinDate();
            return !minDate || inst.drawDate.newDate().add(-1, "d").compareTo(minDate) !== -1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(-1, "d");
          },
          action: function() {
            plugin.changeDay(this, -1);
          }
        },
        nextDay: {
          text: "nextDayText",
          status: "nextDayStatus",
          keystroke: { keyCode: 39, ctrlKey: true },
          enabled: function(inst) {
            var maxDate = inst.get("maxDate");
            return !maxDate || inst.drawDate.newDate().add(1, "d").compareTo(maxDate) !== 1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(1, "d");
          },
          action: function() {
            plugin.changeDay(this, 1);
          }
        },
        nextWeek: {
          text: "nextWeekText",
          status: "nextWeekStatus",
          keystroke: { keyCode: 40, ctrlKey: true },
          enabled: function(inst) {
            var maxDate = inst.get("maxDate");
            return !maxDate || inst.drawDate.newDate().add(inst.options.calendar.daysInWeek(), "d").compareTo(maxDate) !== 1;
          },
          date: function(inst) {
            return inst.drawDate.newDate().add(inst.options.calendar.daysInWeek(), "d");
          },
          action: function(inst) {
            plugin.changeDay(this, inst.options.calendar.daysInWeek());
          }
        }
      },
      defaultOptions: {
        calendar: $2.calendars.instance(),
        pickerClass: "",
        showOnFocus: true,
        showTrigger: null,
        showAnim: "show",
        showOptions: {},
        showSpeed: "normal",
        popupContainer: null,
        alignment: "bottom",
        fixedWeeks: false,
        firstDay: null,
        calculateWeek: null,
        localNumbers: false,
        monthsToShow: 1,
        monthsOffset: 0,
        monthsToStep: 1,
        monthsToJump: 12,
        useMouseWheel: true,
        changeMonth: true,
        yearRange: "c-10:c+10",
        showOtherMonths: false,
        selectOtherMonths: false,
        defaultDate: null,
        selectDefaultDate: false,
        minDate: null,
        maxDate: null,
        dateFormat: null,
        autoSize: false,
        rangeSelect: false,
        rangeSeparator: " - ",
        multiSelect: 0,
        multiSeparator: ",",
        onDate: null,
        onShow: null,
        onChangeMonthYear: null,
        onSelect: null,
        onClose: null,
        altField: null,
        altFormat: null,
        constrainInput: true,
        commandsAsDateFormat: false,
        commands: {}
      },
      regionalOptions: {
        "": {
          renderer: {},
          prevText: "&lt;Prev",
          prevStatus: "Show the previous month",
          prevJumpText: "&lt;&lt;",
          prevJumpStatus: "Show the previous year",
          nextText: "Next&gt;",
          nextStatus: "Show the next month",
          nextJumpText: "&gt;&gt;",
          nextJumpStatus: "Show the next year",
          currentText: "Current",
          currentStatus: "Show the current month",
          todayText: "Today",
          todayStatus: "Show today's month",
          clearText: "Clear",
          clearStatus: "Clear all the dates",
          closeText: "Close",
          closeStatus: "Close the datepicker",
          yearStatus: "Change the year",
          earlierText: "&#160;&#160;\u25B2",
          laterText: "&#160;&#160;\u25BC",
          monthStatus: "Change the month",
          weekText: "Wk",
          weekStatus: "Week of the year",
          dayStatus: "Select DD, M d, yyyy",
          defaultStatus: "Select a date",
          isRTL: false
        }
      },
      _disabled: [],
      _popupClass: "calendars-popup",
      _triggerClass: "calendars-trigger",
      _disableClass: "calendars-disable",
      _monthYearClass: "calendars-month-year",
      _curMonthClass: "calendars-month-",
      _anyYearClass: "calendars-any-year",
      _curDoWClass: "calendars-dow-",
      _init: function() {
        this.defaultOptions.commands = this.commands;
        this.regionalOptions[""].renderer = this.defaultRenderer;
        this._super();
      },
      _instSettings: function(elem2, options) {
        return {
          selectedDates: [],
          drawDate: null,
          pickingRange: false,
          inline: $2.inArray(elem2[0].nodeName.toLowerCase(), ["div", "span"]) > -1,
          get: function(name) {
            if ($2.inArray(name, ["defaultDate", "minDate", "maxDate"]) > -1) {
              return this.options.calendar.determineDate(
                this.options[name],
                null,
                this.selectedDates[0],
                this.get("dateFormat"),
                this.getConfig()
              );
            }
            if (name === "dateFormat") {
              return this.options.dateFormat || this.options.calendar.local.dateFormat;
            }
            return this.options[name];
          },
          curMinDate: function() {
            return this.pickingRange ? this.selectedDates[0] : this.get("minDate");
          },
          getConfig: function() {
            return {
              dayNamesShort: this.options.dayNamesShort,
              dayNames: this.options.dayNames,
              monthNamesShort: this.options.monthNamesShort,
              monthNames: this.options.monthNames,
              calculateWeek: this.options.calculateWeek,
              shortYearCutoff: this.options.shortYearCutoff
            };
          }
        };
      },
      _postAttach: function(elem2, inst) {
        if (inst.inline) {
          inst.drawDate = plugin._checkMinMax((inst.selectedDates[0] || inst.get("defaultDate") || inst.options.calendar.today()).newDate(), inst);
          inst.prevDate = inst.drawDate.newDate();
          this._update(elem2[0]);
          if ($2.fn.mousewheel) {
            elem2.mousewheel(this._doMouseWheel);
          }
        } else {
          this._attachments(elem2, inst);
          elem2.on("keydown." + inst.name, this._keyDown).on("keypress." + inst.name, this._keyPress).on("keyup." + inst.name, this._keyUp);
          if (elem2.attr("disabled")) {
            this.disable(elem2[0]);
          }
        }
      },
      _optionsChanged: function(elem2, inst, options) {
        if (options.calendar && options.calendar !== inst.options.calendar) {
          var discardDate = function(name) {
            return typeof inst.options[name] === "object" ? null : inst.options[name];
          };
          options = $2.extend({
            defaultDate: discardDate("defaultDate"),
            minDate: discardDate("minDate"),
            maxDate: discardDate("maxDate")
          }, options);
          inst.selectedDates = [];
          inst.drawDate = null;
        }
        var dates = inst.selectedDates;
        $2.extend(inst.options, options);
        this.setDate(elem2[0], dates, null, false, true);
        inst.pickingRange = false;
        var calendar = inst.options.calendar;
        var defaultDate = inst.get("defaultDate");
        inst.drawDate = this._checkMinMax((defaultDate ? defaultDate : inst.drawDate) || defaultDate || calendar.today(), inst).newDate();
        if (!inst.inline) {
          this._attachments(elem2, inst);
        }
        if (inst.inline || inst.div) {
          this._update(elem2[0]);
        }
      },
      _attachments: function(elem2, inst) {
        elem2.off("focus." + inst.name);
        if (inst.options.showOnFocus) {
          elem2.on("focus." + inst.name, this.show);
        }
        if (inst.trigger) {
          inst.trigger.remove();
        }
        var trigger = inst.options.showTrigger;
        inst.trigger = !trigger ? $2([]) : $2(trigger).clone().removeAttr("id").addClass(this._triggerClass)[inst.options.isRTL ? "insertBefore" : "insertAfter"](elem2).click(function() {
          if (!plugin.isDisabled(elem2[0])) {
            plugin[plugin.curInst === inst ? "hide" : "show"](elem2[0]);
          }
        });
        this._autoSize(elem2, inst);
        var dates = this._extractDates(inst, elem2.val());
        if (dates) {
          this.setDate(elem2[0], dates, null, true);
        }
        var defaultDate = inst.get("defaultDate");
        if (inst.options.selectDefaultDate && defaultDate && inst.selectedDates.length === 0) {
          this.setDate(elem2[0], (defaultDate || inst.options.calendar.today()).newDate());
        }
      },
      _autoSize: function(elem2, inst) {
        if (inst.options.autoSize && !inst.inline) {
          var calendar = inst.options.calendar;
          var date = calendar.newDate(2009, 10, 20);
          var dateFormat = inst.get("dateFormat");
          if (dateFormat.match(/[DM]/)) {
            var findMax = function(names) {
              var max = 0;
              var maxI = 0;
              for (var i = 0; i < names.length; i++) {
                if (names[i].length > max) {
                  max = names[i].length;
                  maxI = i;
                }
              }
              return maxI;
            };
            date.month(findMax(calendar.local[dateFormat.match(/MM/) ? "monthNames" : "monthNamesShort"]) + 1);
            date.day(findMax(calendar.local[dateFormat.match(/DD/) ? "dayNames" : "dayNamesShort"]) + 20 - date.dayOfWeek());
          }
          inst.elem.attr("size", date.formatDate(
            dateFormat,
            { localNumbers: inst.options.localnumbers }
          ).length);
        }
      },
      _preDestroy: function(elem2, inst) {
        if (inst.trigger) {
          inst.trigger.remove();
        }
        elem2.empty().off("." + inst.name);
        if (inst.inline && $2.fn.mousewheel) {
          elem2.unmousewheel();
        }
        if (!inst.inline && inst.options.autoSize) {
          elem2.removeAttr("size");
        }
      },
      multipleEvents: function(fns) {
        var funcs = arguments;
        return function() {
          for (var i = 0; i < funcs.length; i++) {
            funcs[i].apply(this, arguments);
          }
        };
      },
      enable: function(elem2) {
        elem2 = $2(elem2);
        if (!elem2.hasClass(this._getMarker())) {
          return;
        }
        var inst = this._getInst(elem2);
        if (inst.inline) {
          elem2.children("." + this._disableClass).remove().end().find("button,select").prop("disabled", false).end().find("a").attr("href", "#");
        } else {
          elem2.prop("disabled", false);
          inst.trigger.filter("button." + this._triggerClass).prop("disabled", false).end().filter("img." + this._triggerClass).css({ opacity: "1.0", cursor: "" });
        }
        this._disabled = $2.map(
          this._disabled,
          function(value2) {
            return value2 === elem2[0] ? null : value2;
          }
        );
      },
      disable: function(elem2) {
        elem2 = $2(elem2);
        if (!elem2.hasClass(this._getMarker())) {
          return;
        }
        var inst = this._getInst(elem2);
        if (inst.inline) {
          var inline = elem2.children(":last");
          var offset = inline.offset();
          var relOffset = { left: 0, top: 0 };
          inline.parents().each(function() {
            if ($2(this).css("position") === "relative") {
              relOffset = $2(this).offset();
              return false;
            }
          });
          var zIndex = elem2.css("zIndex");
          zIndex = (zIndex === "auto" ? 0 : parseInt(zIndex, 10)) + 1;
          elem2.prepend('<div class="' + this._disableClass + '" style="width: ' + inline.outerWidth() + "px; height: " + inline.outerHeight() + "px; left: " + (offset.left - relOffset.left) + "px; top: " + (offset.top - relOffset.top) + "px; z-index: " + zIndex + '"></div>').find("button,select").prop("disabled", true).end().find("a").removeAttr("href");
        } else {
          elem2.prop("disabled", true);
          inst.trigger.filter("button." + this._triggerClass).prop("disabled", true).end().filter("img." + this._triggerClass).css({ opacity: "0.5", cursor: "default" });
        }
        this._disabled = $2.map(
          this._disabled,
          function(value2) {
            return value2 === elem2[0] ? null : value2;
          }
        );
        this._disabled.push(elem2[0]);
      },
      isDisabled: function(elem2) {
        return elem2 && $2.inArray(elem2, this._disabled) > -1;
      },
      show: function(elem2) {
        elem2 = $2(elem2.target || elem2);
        var inst = plugin._getInst(elem2);
        if (plugin.curInst === inst) {
          return;
        }
        if (plugin.curInst) {
          plugin.hide(plugin.curInst, true);
        }
        if (!$2.isEmptyObject(inst)) {
          inst.lastVal = null;
          inst.selectedDates = plugin._extractDates(inst, elem2.val());
          inst.pickingRange = false;
          inst.drawDate = plugin._checkMinMax((inst.selectedDates[0] || inst.get("defaultDate") || inst.options.calendar.today()).newDate(), inst);
          inst.prevDate = inst.drawDate.newDate();
          plugin.curInst = inst;
          plugin._update(elem2[0], true);
          var offset = plugin._checkOffset(inst);
          inst.div.css({ left: offset.left, top: offset.top });
          var showAnim = inst.options.showAnim;
          var showSpeed = inst.options.showSpeed;
          showSpeed = showSpeed === "normal" && $2.ui && parseInt($2.ui.version.substring(2)) >= 8 ? "_default" : showSpeed;
          if ($2.effects && ($2.effects[showAnim] || $2.effects.effect && $2.effects.effect[showAnim])) {
            var data2 = inst.div.data();
            for (var key2 in data2) {
              if (key2.match(/^ec\.storage\./)) {
                data2[key2] = inst._mainDiv.css(key2.replace(/ec\.storage\./, ""));
              }
            }
            inst.div.data(data2).show(showAnim, inst.options.showOptions, showSpeed);
          } else {
            inst.div[showAnim || "show"](showAnim ? showSpeed : 0);
          }
        }
      },
      _extractDates: function(inst, datesText) {
        if (datesText === inst.lastVal) {
          return;
        }
        inst.lastVal = datesText;
        datesText = datesText.split(inst.options.multiSelect ? inst.options.multiSeparator : inst.options.rangeSelect ? inst.options.rangeSeparator : "\0");
        var dates = [];
        for (var i = 0; i < datesText.length; i++) {
          try {
            var date = inst.options.calendar.parseDate(inst.get("dateFormat"), datesText[i]);
            if (date) {
              var found = false;
              for (var j = 0; j < dates.length; j++) {
                if (dates[j].compareTo(date) === 0) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                dates.push(date);
              }
            }
          } catch (e) {
          }
        }
        dates.splice(inst.options.multiSelect || (inst.options.rangeSelect ? 2 : 1), dates.length);
        if (inst.options.rangeSelect && dates.length === 1) {
          dates[1] = dates[0];
        }
        return dates;
      },
      _update: function(elem2, hidden) {
        elem2 = $2(elem2.target || elem2);
        var inst = plugin._getInst(elem2);
        if (!$2.isEmptyObject(inst)) {
          if (inst.inline || plugin.curInst === inst) {
            if ($2.isFunction(inst.options.onChangeMonthYear) && (!inst.prevDate || inst.prevDate.year() !== inst.drawDate.year() || inst.prevDate.month() !== inst.drawDate.month())) {
              inst.options.onChangeMonthYear.apply(
                elem2[0],
                [inst.drawDate.year(), inst.drawDate.month()]
              );
            }
          }
          if (inst.inline) {
            var index = $2("a, :input", elem2).index($2(":focus", elem2));
            elem2.html(this._generateContent(elem2[0], inst));
            var focus = elem2.find("a, :input");
            focus.eq(Math.max(Math.min(index, focus.length - 1), 0)).focus();
          } else if (plugin.curInst === inst) {
            if (!inst.div) {
              inst.div = $2("<div></div>").addClass(this._popupClass).css({
                display: hidden ? "none" : "static",
                position: "absolute",
                left: elem2.offset().left,
                top: elem2.offset().top + elem2.outerHeight()
              }).appendTo($2(inst.options.popupContainer || "body"));
              if ($2.fn.mousewheel) {
                inst.div.mousewheel(this._doMouseWheel);
              }
            }
            inst.div.html(this._generateContent(elem2[0], inst));
            elem2.focus();
          }
        }
      },
      _updateInput: function(elem2, keyUp) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst)) {
          var value2 = "";
          var altValue = "";
          var sep = inst.options.multiSelect ? inst.options.multiSeparator : inst.options.rangeSeparator;
          var calendar = inst.options.calendar;
          var dateFormat = inst.get("dateFormat");
          var altFormat = inst.options.altFormat || dateFormat;
          var settings = { localNumbers: inst.options.localNumbers };
          for (var i = 0; i < inst.selectedDates.length; i++) {
            value2 += keyUp ? "" : (i > 0 ? sep : "") + calendar.formatDate(dateFormat, inst.selectedDates[i], settings);
            altValue += (i > 0 ? sep : "") + calendar.formatDate(altFormat, inst.selectedDates[i], settings);
          }
          if (!inst.inline && !keyUp) {
            $2(elem2).val(value2);
          }
          $2(inst.options.altField).val(altValue);
          if ($2.isFunction(inst.options.onSelect) && !keyUp && !inst.inSelect) {
            inst.inSelect = true;
            inst.options.onSelect.apply(elem2, [inst.selectedDates]);
            inst.inSelect = false;
          }
          $2(elem2).change();
        }
      },
      _getBorders: function(elem2) {
        var convert = function(value2) {
          return { thin: 1, medium: 3, thick: 5 }[value2] || value2;
        };
        return [
          parseFloat(convert(elem2.css("border-left-width"))),
          parseFloat(convert(elem2.css("border-top-width")))
        ];
      },
      _checkOffset: function(inst) {
        var base = inst.elem.is(":hidden") && inst.trigger ? inst.trigger : inst.elem;
        var offset = base.offset();
        var browserWidth = $2(window).width();
        var browserHeight = $2(window).height();
        if (browserWidth === 0) {
          return offset;
        }
        var isFixed = false;
        $2(inst.elem).parents().each(function() {
          isFixed = isFixed || $2(this).css("position") === "fixed";
          return !isFixed;
        });
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var above = offset.top - (isFixed ? scrollY : 0) - inst.div.outerHeight();
        var below = offset.top - (isFixed ? scrollY : 0) + base.outerHeight();
        var alignL = offset.left - (isFixed ? scrollX : 0);
        var alignR = offset.left - (isFixed ? scrollX : 0) + base.outerWidth() - inst.div.outerWidth();
        var tooWide = offset.left - scrollX + inst.div.outerWidth() > browserWidth;
        var tooHigh = offset.top - scrollY + inst.elem.outerHeight() + inst.div.outerHeight() > browserHeight;
        inst.div.css("position", isFixed ? "fixed" : "absolute");
        var alignment = inst.options.alignment;
        if (alignment === "topLeft") {
          offset = { left: alignL, top: above };
        } else if (alignment === "topRight") {
          offset = { left: alignR, top: above };
        } else if (alignment === "bottomLeft") {
          offset = { left: alignL, top: below };
        } else if (alignment === "bottomRight") {
          offset = { left: alignR, top: below };
        } else if (alignment === "top") {
          offset = { left: inst.options.isRTL || tooWide ? alignR : alignL, top: above };
        } else {
          offset = {
            left: inst.options.isRTL || tooWide ? alignR : alignL,
            top: tooHigh ? above : below
          };
        }
        offset.left = Math.max(isFixed ? 0 : scrollX, offset.left);
        offset.top = Math.max(isFixed ? 0 : scrollY, offset.top);
        return offset;
      },
      _checkExternalClick: function(event2) {
        if (!plugin.curInst) {
          return;
        }
        var elem2 = $2(event2.target);
        if (elem2.closest("." + plugin._popupClass + ",." + plugin._triggerClass).length === 0 && !elem2.hasClass(plugin._getMarker())) {
          plugin.hide(plugin.curInst);
        }
      },
      hide: function(elem2, immediate) {
        if (!elem2) {
          return;
        }
        var inst = this._getInst(elem2);
        if ($2.isEmptyObject(inst)) {
          inst = elem2;
        }
        if (inst && inst === plugin.curInst) {
          var showAnim = immediate ? "" : inst.options.showAnim;
          var showSpeed = inst.options.showSpeed;
          showSpeed = showSpeed === "normal" && $2.ui && parseInt($2.ui.version.substring(2)) >= 8 ? "_default" : showSpeed;
          var postProcess = function() {
            if (!inst.div) {
              return;
            }
            inst.div.remove();
            inst.div = null;
            plugin.curInst = null;
            if ($2.isFunction(inst.options.onClose)) {
              inst.options.onClose.apply(elem2, [inst.selectedDates]);
            }
          };
          inst.div.stop();
          if ($2.effects && ($2.effects[showAnim] || $2.effects.effect && $2.effects.effect[showAnim])) {
            inst.div.hide(showAnim, inst.options.showOptions, showSpeed, postProcess);
          } else {
            var hideAnim = showAnim === "slideDown" ? "slideUp" : showAnim === "fadeIn" ? "fadeOut" : "hide";
            inst.div[hideAnim](showAnim ? showSpeed : "", postProcess);
          }
          if (!showAnim) {
            postProcess();
          }
        }
      },
      _keyDown: function(event2) {
        var elem2 = event2.data && event2.data.elem || event2.target;
        var inst = plugin._getInst(elem2);
        var handled = false;
        var command;
        if (inst.inline || inst.div) {
          if (event2.keyCode === 9) {
            plugin.hide(elem2);
          } else if (event2.keyCode === 13) {
            plugin.selectDate(
              elem2,
              $2("a." + inst.options.renderer.highlightedClass, inst.div)[0]
            );
            handled = true;
          } else {
            var commands = inst.options.commands;
            for (var name in commands) {
              if (inst.options.commands.hasOwnProperty(name)) {
                command = commands[name];
                if (command.keystroke.keyCode === event2.keyCode && !!command.keystroke.ctrlKey === !!(event2.ctrlKey || event2.metaKey) && !!command.keystroke.altKey === event2.altKey && !!command.keystroke.shiftKey === event2.shiftKey) {
                  plugin.performAction(elem2, name);
                  handled = true;
                  break;
                }
              }
            }
          }
        } else {
          command = inst.options.commands.current;
          if (command.keystroke.keyCode === event2.keyCode && !!command.keystroke.ctrlKey === !!(event2.ctrlKey || event2.metaKey) && !!command.keystroke.altKey === event2.altKey && !!command.keystroke.shiftKey === event2.shiftKey) {
            plugin.show(elem2);
            handled = true;
          }
        }
        inst.ctrlKey = event2.keyCode < 48 && event2.keyCode !== 32 || event2.ctrlKey || event2.metaKey;
        if (handled) {
          event2.preventDefault();
          event2.stopPropagation();
        }
        return !handled;
      },
      _keyPress: function(event2) {
        var inst = plugin._getInst(event2.data && event2.data.elem || event2.target);
        if (!$2.isEmptyObject(inst) && inst.options.constrainInput) {
          var ch = String.fromCharCode(event2.keyCode || event2.charCode);
          var allowedChars = plugin._allowedChars(inst);
          return event2.metaKey || inst.ctrlKey || ch < " " || !allowedChars || allowedChars.indexOf(ch) > -1;
        }
        return true;
      },
      _allowedChars: function(inst) {
        var allowedChars = inst.options.multiSelect ? inst.options.multiSeparator : inst.options.rangeSelect ? inst.options.rangeSeparator : "";
        var literal = false;
        var hasNum = false;
        var dateFormat = inst.get("dateFormat");
        for (var i = 0; i < dateFormat.length; i++) {
          var ch = dateFormat.charAt(i);
          if (literal) {
            if (ch === "'" && dateFormat.charAt(i + 1) !== "'") {
              literal = false;
            } else {
              allowedChars += ch;
            }
          } else {
            switch (ch) {
              case "d":
              case "m":
              case "o":
              case "w":
                allowedChars += hasNum ? "" : "0123456789";
                hasNum = true;
                break;
              case "y":
              case "@":
              case "!":
                allowedChars += (hasNum ? "" : "0123456789") + "-";
                hasNum = true;
                break;
              case "J":
                allowedChars += (hasNum ? "" : "0123456789") + "-.";
                hasNum = true;
                break;
              case "D":
              case "M":
              case "Y":
                return null;
              case "'":
                if (dateFormat.charAt(i + 1) === "'") {
                  allowedChars += "'";
                } else {
                  literal = true;
                }
                break;
              default:
                allowedChars += ch;
            }
          }
        }
        return allowedChars;
      },
      _keyUp: function(event2) {
        var elem2 = event2.data && event2.data.elem || event2.target;
        var inst = plugin._getInst(elem2);
        if (!$2.isEmptyObject(inst) && !inst.ctrlKey && inst.lastVal !== inst.elem.val()) {
          try {
            var dates = plugin._extractDates(inst, inst.elem.val());
            if (dates.length > 0) {
              plugin.setDate(elem2, dates, null, true);
            }
          } catch (e) {
          }
        }
        return true;
      },
      _doMouseWheel: function(event2, delta) {
        var elem2 = plugin.curInst && plugin.curInst.elem[0] || $2(event2.target).closest("." + plugin._getMarker())[0];
        if (plugin.isDisabled(elem2)) {
          return;
        }
        var inst = plugin._getInst(elem2);
        if (inst.options.useMouseWheel) {
          delta = delta < 0 ? -1 : 1;
          plugin.changeMonth(elem2, -inst.options[event2.ctrlKey ? "monthsToJump" : "monthsToStep"] * delta);
        }
        event2.preventDefault();
      },
      clear: function(elem2) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst)) {
          inst.selectedDates = [];
          this.hide(elem2);
          var defaultDate = inst.get("defaultDate");
          if (inst.options.selectDefaultDate && defaultDate) {
            this.setDate(elem2, (defaultDate || inst.options.calendar.today()).newDate());
          } else {
            this._updateInput(elem2);
          }
        }
      },
      getDate: function(elem2) {
        var inst = this._getInst(elem2);
        return !$2.isEmptyObject(inst) ? inst.selectedDates : [];
      },
      setDate: function(elem2, dates, endDate, keyUp, setOpt) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst)) {
          if (!$2.isArray(dates)) {
            dates = [dates];
            if (endDate) {
              dates.push(endDate);
            }
          }
          var minDate = inst.get("minDate");
          var maxDate = inst.get("maxDate");
          var curDate = inst.selectedDates[0];
          inst.selectedDates = [];
          for (var i = 0; i < dates.length; i++) {
            var date = inst.options.calendar.determineDate(
              dates[i],
              null,
              curDate,
              inst.get("dateFormat"),
              inst.getConfig()
            );
            if (date) {
              if ((!minDate || date.compareTo(minDate) !== -1) && (!maxDate || date.compareTo(maxDate) !== 1)) {
                var found = false;
                for (var j = 0; j < inst.selectedDates.length; j++) {
                  if (inst.selectedDates[j].compareTo(date) === 0) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  inst.selectedDates.push(date);
                }
              }
            }
          }
          inst.selectedDates.splice(inst.options.multiSelect || (inst.options.rangeSelect ? 2 : 1), inst.selectedDates.length);
          if (inst.options.rangeSelect) {
            switch (inst.selectedDates.length) {
              case 1:
                inst.selectedDates[1] = inst.selectedDates[0];
                break;
              case 2:
                inst.selectedDates[1] = inst.selectedDates[0].compareTo(inst.selectedDates[1]) === 1 ? inst.selectedDates[0] : inst.selectedDates[1];
                break;
            }
            inst.pickingRange = false;
          }
          inst.prevDate = inst.drawDate ? inst.drawDate.newDate() : null;
          inst.drawDate = this._checkMinMax((inst.selectedDates[0] || inst.get("defaultDate") || inst.options.calendar.today()).newDate(), inst);
          if (!setOpt) {
            this._update(elem2);
            this._updateInput(elem2, keyUp);
          }
        }
      },
      isSelectable: function(elem2, date) {
        var inst = this._getInst(elem2);
        if ($2.isEmptyObject(inst)) {
          return false;
        }
        date = inst.options.calendar.determineDate(
          date,
          inst.selectedDates[0] || inst.options.calendar.today(),
          null,
          inst.options.dateFormat,
          inst.getConfig()
        );
        return this._isSelectable(
          elem2,
          date,
          inst.options.onDate,
          inst.get("minDate"),
          inst.get("maxDate")
        );
      },
      _isSelectable: function(elem2, date, onDate, minDate, maxDate) {
        var dateInfo = typeof onDate === "boolean" ? { selectable: onDate } : !$2.isFunction(onDate) ? {} : onDate.apply(elem2, [date, true]);
        return dateInfo.selectable !== false && (!minDate || date.toJD() >= minDate.toJD()) && (!maxDate || date.toJD() <= maxDate.toJD());
      },
      performAction: function(elem2, action) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst) && !this.isDisabled(elem2)) {
          var commands = inst.options.commands;
          if (commands[action] && commands[action].enabled.apply(elem2, [inst])) {
            commands[action].action.apply(elem2, [inst]);
          }
        }
      },
      showMonth: function(elem2, year, month, day) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst) && (typeof day !== "undefined" && day !== null || inst.drawDate.year() !== year || inst.drawDate.month() !== month)) {
          inst.prevDate = inst.drawDate.newDate();
          var calendar = inst.options.calendar;
          var show = this._checkMinMax(typeof year !== "undefined" && year !== null ? calendar.newDate(year, month, 1) : calendar.today(), inst);
          inst.drawDate.date(
            show.year(),
            show.month(),
            typeof day !== "undefined" && day !== null ? day : Math.min(
              inst.drawDate.day(),
              calendar.daysInMonth(show.year(), show.month())
            )
          );
          this._update(elem2);
        }
      },
      changeMonth: function(elem2, offset) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst)) {
          var date = inst.drawDate.newDate().add(offset, "m");
          this.showMonth(elem2, date.year(), date.month());
        }
      },
      changeDay: function(elem2, offset) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst)) {
          var date = inst.drawDate.newDate().add(offset, "d");
          this.showMonth(elem2, date.year(), date.month(), date.day());
        }
      },
      _checkMinMax: function(date, inst) {
        var minDate = inst.get("minDate");
        var maxDate = inst.get("maxDate");
        date = minDate && date.compareTo(minDate) === -1 ? minDate.newDate() : date;
        date = maxDate && date.compareTo(maxDate) === 1 ? maxDate.newDate() : date;
        return date;
      },
      retrieveDate: function(elem2, target) {
        var inst = this._getInst(elem2);
        return $2.isEmptyObject(inst) ? null : inst.options.calendar.fromJD(
          parseFloat(target.className.replace(/^.*jd(\d+\.5).*$/, "$1"))
        );
      },
      selectDate: function(elem2, target) {
        var inst = this._getInst(elem2);
        if (!$2.isEmptyObject(inst) && !this.isDisabled(elem2)) {
          var date = this.retrieveDate(elem2, target);
          if (inst.options.multiSelect) {
            var found = false;
            for (var i = 0; i < inst.selectedDates.length; i++) {
              if (date.compareTo(inst.selectedDates[i]) === 0) {
                inst.selectedDates.splice(i, 1);
                found = true;
                break;
              }
            }
            if (!found && inst.selectedDates.length < inst.options.multiSelect) {
              inst.selectedDates.push(date);
            }
          } else if (inst.options.rangeSelect) {
            if (inst.pickingRange) {
              inst.selectedDates[1] = date;
            } else {
              inst.selectedDates = [date, date];
            }
            inst.pickingRange = !inst.pickingRange;
          } else {
            inst.selectedDates = [date];
          }
          inst.prevDate = inst.drawDate = date.newDate();
          this._updateInput(elem2);
          if (inst.inline || inst.pickingRange || inst.selectedDates.length < (inst.options.multiSelect || (inst.options.rangeSelect ? 2 : 1))) {
            this._update(elem2);
          } else {
            this.hide(elem2);
          }
        }
      },
      _generateContent: function(elem2, inst) {
        var monthsToShow = inst.options.monthsToShow;
        monthsToShow = $2.isArray(monthsToShow) ? monthsToShow : [1, monthsToShow];
        inst.drawDate = this._checkMinMax(
          inst.drawDate || inst.get("defaultDate") || inst.options.calendar.today(),
          inst
        );
        var drawDate = inst.drawDate.newDate().add(-inst.options.monthsOffset, "m");
        var monthRows = "";
        for (var row = 0; row < monthsToShow[0]; row++) {
          var months = "";
          for (var col = 0; col < monthsToShow[1]; col++) {
            months += this._generateMonth(
              elem2,
              inst,
              drawDate.year(),
              drawDate.month(),
              inst.options.calendar,
              inst.options.renderer,
              row === 0 && col === 0
            );
            drawDate.add(1, "m");
          }
          monthRows += this._prepare(inst.options.renderer.monthRow, inst).replace(/\{months\}/, months);
        }
        var picker = this._prepare(inst.options.renderer.picker, inst).replace(/\{months\}/, monthRows).replace(/\{weekHeader\}/g, this._generateDayHeaders(inst, inst.options.calendar, inst.options.renderer));
        var addCommand = function(type, open, close, name2, classes) {
          if (picker.indexOf("{" + type + ":" + name2 + "}") === -1) {
            return;
          }
          var command = inst.options.commands[name2];
          var date = inst.options.commandsAsDateFormat ? command.date.apply(elem2, [inst]) : null;
          picker = picker.replace(
            new RegExp("\\{" + type + ":" + name2 + "\\}", "g"),
            "<" + open + (command.status ? ' title="' + inst.options[command.status] + '"' : "") + ' class="' + inst.options.renderer.commandClass + " " + inst.options.renderer.commandClass + "-" + name2 + " " + classes + (command.enabled(inst) ? "" : " " + inst.options.renderer.disabledClass) + '">' + (date ? date.formatDate(inst.options[command.text], { localNumbers: inst.options.localNumbers }) : inst.options[command.text]) + "</" + close + ">"
          );
        };
        for (var name in inst.options.commands) {
          if (inst.options.commands.hasOwnProperty(name)) {
            addCommand(
              "button",
              'button type="button"',
              "button",
              name,
              inst.options.renderer.commandButtonClass
            );
            addCommand(
              "link",
              'a href="javascript:void(0)"',
              "a",
              name,
              inst.options.renderer.commandLinkClass
            );
          }
        }
        picker = $2(picker);
        if (monthsToShow[1] > 1) {
          var count = 0;
          $2(inst.options.renderer.monthSelector, picker).each(function() {
            var nth = ++count % monthsToShow[1];
            $2(this).addClass(nth === 1 ? "first" : nth === 0 ? "last" : "");
          });
        }
        var self = this;
        function removeHighlight(elem3) {
          (inst.inline ? $2(elem3).closest("." + self._getMarker()) : inst.div).find(inst.options.renderer.daySelector + " a").removeClass(inst.options.renderer.highlightedClass);
        }
        picker.find(inst.options.renderer.daySelector + " a").hover(
          function() {
            removeHighlight(this);
            $2(this).addClass(inst.options.renderer.highlightedClass);
          },
          function() {
            removeHighlight(this);
          }
        ).click(function() {
          self.selectDate(elem2, this);
        }).end().find("select." + this._monthYearClass + ":not(." + this._anyYearClass + ")").change(function() {
          var monthYear = $2(this).val().split("/");
          self.showMonth(elem2, parseInt(monthYear[1], 10), parseInt(monthYear[0], 10));
        }).end().find("select." + this._anyYearClass).click(function() {
          $2(this).css("visibility", "hidden").next("input").css({
            left: this.offsetLeft,
            top: this.offsetTop,
            width: this.offsetWidth,
            height: this.offsetHeight
          }).show().focus();
        }).end().find("input." + self._monthYearClass).change(function() {
          try {
            var year = parseInt($2(this).val(), 10);
            year = isNaN(year) ? inst.drawDate.year() : year;
            self.showMonth(elem2, year, inst.drawDate.month(), inst.drawDate.day());
          } catch (e) {
          }
        }).keydown(function(event2) {
          if (event2.keyCode === 13) {
            $2(event2.elem).change();
          } else if (event2.keyCode === 27) {
            $2(event2.elem).hide().prev("select").css("visibility", "visible");
            inst.elem.focus();
          }
        });
        var data2 = { elem: inst.elem[0] };
        picker.keydown(data2, this._keyDown).keypress(data2, this._keyPress).keyup(data2, this._keyUp);
        picker.find("." + inst.options.renderer.commandClass).click(function() {
          if (!$2(this).hasClass(inst.options.renderer.disabledClass)) {
            var action = this.className.replace(
              new RegExp("^.*" + inst.options.renderer.commandClass + "-([^ ]+).*$"),
              "$1"
            );
            plugin.performAction(elem2, action);
          }
        });
        if (inst.options.isRTL) {
          picker.addClass(inst.options.renderer.rtlClass);
        }
        if (monthsToShow[0] * monthsToShow[1] > 1) {
          picker.addClass(inst.options.renderer.multiClass);
        }
        if (inst.options.pickerClass) {
          picker.addClass(inst.options.pickerClass);
        }
        $2("body").append(picker);
        var width = 0;
        picker.find(inst.options.renderer.monthSelector).each(function() {
          width += $2(this).outerWidth();
        });
        picker.width(width / monthsToShow[0]);
        if ($2.isFunction(inst.options.onShow)) {
          inst.options.onShow.apply(elem2, [picker, inst.options.calendar, inst]);
        }
        return picker;
      },
      _generateMonth: function(elem2, inst, year, month, calendar, renderer, first) {
        var daysInMonth = calendar.daysInMonth(year, month);
        var monthsToShow = inst.options.monthsToShow;
        monthsToShow = $2.isArray(monthsToShow) ? monthsToShow : [1, monthsToShow];
        var fixedWeeks = inst.options.fixedWeeks || monthsToShow[0] * monthsToShow[1] > 1;
        var firstDay = inst.options.firstDay;
        firstDay = typeof firstDay === "undefined" || firstDay === null ? calendar.local.firstDay : firstDay;
        var leadDays = (calendar.dayOfWeek(year, month, calendar.minDay) - firstDay + calendar.daysInWeek()) % calendar.daysInWeek();
        var numWeeks = fixedWeeks ? 6 : Math.ceil((leadDays + daysInMonth) / calendar.daysInWeek());
        var selectOtherMonths = inst.options.selectOtherMonths && inst.options.showOtherMonths;
        var minDate = inst.pickingRange ? inst.selectedDates[0] : inst.get("minDate");
        var maxDate = inst.get("maxDate");
        var showWeeks = renderer.week.indexOf("{weekOfYear}") > -1;
        var today = calendar.today();
        var drawDate = calendar.newDate(year, month, calendar.minDay);
        drawDate.add(-leadDays - (fixedWeeks && (drawDate.dayOfWeek() === firstDay || drawDate.daysInMonth() < calendar.daysInWeek()) ? calendar.daysInWeek() : 0), "d");
        var jd = drawDate.toJD();
        var localiseNumbers = function(value2) {
          return inst.options.localNumbers && calendar.local.digits ? calendar.local.digits(value2) : value2;
        };
        var weeks = "";
        for (var week = 0; week < numWeeks; week++) {
          var weekOfYear = !showWeeks ? "" : '<span class="jd' + jd + '">' + ($2.isFunction(inst.options.calculateWeek) ? inst.options.calculateWeek(drawDate) : drawDate.weekOfYear()) + "</span>";
          var days = "";
          for (var day = 0; day < calendar.daysInWeek(); day++) {
            var selected = false;
            if (inst.options.rangeSelect && inst.selectedDates.length > 0) {
              selected = drawDate.compareTo(inst.selectedDates[0]) !== -1 && drawDate.compareTo(inst.selectedDates[1]) !== 1;
            } else {
              for (var i = 0; i < inst.selectedDates.length; i++) {
                if (inst.selectedDates[i].compareTo(drawDate) === 0) {
                  selected = true;
                  break;
                }
              }
            }
            var dateInfo = !$2.isFunction(inst.options.onDate) ? {} : inst.options.onDate.apply(elem2, [drawDate, drawDate.month() === month]);
            var selectable = (selectOtherMonths || drawDate.month() === month) && this._isSelectable(elem2, drawDate, dateInfo.selectable, minDate, maxDate);
            days += this._prepare(renderer.day, inst).replace(
              /\{day\}/g,
              (selectable ? '<a href="javascript:void(0)"' : "<span") + ' class="jd' + jd + " " + (dateInfo.dateClass || "") + (selected && (selectOtherMonths || drawDate.month() === month) ? " " + renderer.selectedClass : "") + (selectable ? " " + renderer.defaultClass : "") + (drawDate.weekDay() ? "" : " " + renderer.weekendClass) + (drawDate.month() === month ? "" : " " + renderer.otherMonthClass) + (drawDate.compareTo(today) === 0 && drawDate.month() === month ? " " + renderer.todayClass : "") + (drawDate.compareTo(inst.drawDate) === 0 && drawDate.month() === month ? " " + renderer.highlightedClass : "") + '"' + (dateInfo.title || inst.options.dayStatus && selectable ? ' title="' + (dateInfo.title || drawDate.formatDate(
                inst.options.dayStatus,
                { localNumbers: inst.options.localNumbers }
              )) + '"' : "") + ">" + (inst.options.showOtherMonths || drawDate.month() === month ? dateInfo.content || localiseNumbers(drawDate.day()) : "&#160;") + (selectable ? "</a>" : "</span>")
            );
            drawDate.add(1, "d");
            jd++;
          }
          weeks += this._prepare(renderer.week, inst).replace(/\{days\}/g, days).replace(/\{weekOfYear\}/g, weekOfYear);
        }
        var monthHeader = this._prepare(renderer.month, inst).match(/\{monthHeader(:[^\}]+)?\}/);
        monthHeader = monthHeader[0].length <= 13 ? "MM yyyy" : monthHeader[0].substring(13, monthHeader[0].length - 1);
        monthHeader = first ? this._generateMonthSelection(
          inst,
          year,
          month,
          minDate,
          maxDate,
          monthHeader,
          calendar,
          renderer
        ) : calendar.formatDate(
          monthHeader,
          calendar.newDate(year, month, calendar.minDay),
          { localNumbers: inst.options.localNumbers }
        );
        var weekHeader = this._prepare(renderer.weekHeader, inst).replace(/\{days\}/g, this._generateDayHeaders(inst, calendar, renderer));
        return this._prepare(renderer.month, inst).replace(/\{monthHeader(:[^\}]+)?\}/g, monthHeader).replace(/\{weekHeader\}/g, weekHeader).replace(/\{weeks\}/g, weeks);
      },
      _generateDayHeaders: function(inst, calendar, renderer) {
        var firstDay = inst.options.firstDay;
        firstDay = typeof firstDay === "undefined" || firstDay === null ? calendar.local.firstDay : firstDay;
        var header = "";
        for (var day = 0; day < calendar.daysInWeek(); day++) {
          var dow = (day + firstDay) % calendar.daysInWeek();
          header += this._prepare(renderer.dayHeader, inst).replace(
            /\{day\}/g,
            '<span class="' + this._curDoWClass + dow + '" title="' + calendar.local.dayNames[dow] + '">' + calendar.local.dayNamesMin[dow] + "</span>"
          );
        }
        return header;
      },
      _generateMonthSelection: function(inst, year, month, minDate, maxDate, monthHeader, calendar) {
        if (!inst.options.changeMonth) {
          return calendar.formatDate(
            monthHeader,
            calendar.newDate(year, month, 1),
            { localNumbers: inst.options.localNumbers }
          );
        }
        var monthNames = calendar.local["monthNames" + (monthHeader.match(/mm/i) ? "" : "Short")];
        var html = monthHeader.replace(/m+/i, "\\x2E").replace(/y+/i, "\\x2F");
        var selector = '<select class="' + this._monthYearClass + '" title="' + inst.options.monthStatus + '">';
        var maxMonth = calendar.monthsInYear(year) + calendar.minMonth;
        for (var m = calendar.minMonth; m < maxMonth; m++) {
          if ((!minDate || calendar.newDate(
            year,
            m,
            calendar.daysInMonth(year, m) - 1 + calendar.minDay
          ).compareTo(minDate) !== -1) && (!maxDate || calendar.newDate(year, m, calendar.minDay).compareTo(maxDate) !== 1)) {
            selector += '<option value="' + m + "/" + year + '"' + (month === m ? ' selected="selected"' : "") + ">" + monthNames[m - calendar.minMonth] + "</option>";
          }
        }
        selector += "</select>";
        html = html.replace(/\\x2E/, selector);
        var localiseNumbers = function(value2) {
          return inst.options.localNumbers && calendar.local.digits ? calendar.local.digits(value2) : value2;
        };
        var yearRange = inst.options.yearRange;
        if (yearRange === "any") {
          selector = '<select class="' + this._monthYearClass + " " + this._anyYearClass + '" title="' + inst.options.yearStatus + '"><option value="' + year + '">' + localiseNumbers(year) + '</option></select><input class="' + this._monthYearClass + " " + this._curMonthClass + month + '" value="' + year + '">';
        } else {
          yearRange = yearRange.split(":");
          var todayYear = calendar.today().year();
          var start = yearRange[0].match("c[+-].*") ? year + parseInt(yearRange[0].substring(1), 10) : (yearRange[0].match("[+-].*") ? todayYear : 0) + parseInt(yearRange[0], 10);
          var end = yearRange[1].match("c[+-].*") ? year + parseInt(yearRange[1].substring(1), 10) : (yearRange[1].match("[+-].*") ? todayYear : 0) + parseInt(yearRange[1], 10);
          selector = '<select class="' + this._monthYearClass + '" title="' + inst.options.yearStatus + '">';
          start = calendar.newDate(start + 1, calendar.firstMonth, calendar.minDay).add(-1, "d");
          end = calendar.newDate(end, calendar.firstMonth, calendar.minDay);
          var addYear = function(y2, yDisplay) {
            if (y2 !== 0 || calendar.hasYearZero) {
              selector += '<option value="' + Math.min(month, calendar.monthsInYear(y2) - 1 + calendar.minMonth) + "/" + y2 + '"' + (year === y2 ? ' selected="selected"' : "") + ">" + (yDisplay || localiseNumbers(y2)) + "</option>";
            }
          };
          var earlierLater, y;
          if (start.toJD() < end.toJD()) {
            start = (minDate && minDate.compareTo(start) === 1 ? minDate : start).year();
            end = (maxDate && maxDate.compareTo(end) === -1 ? maxDate : end).year();
            earlierLater = Math.floor((end - start) / 2);
            if (!minDate || minDate.year() < start) {
              addYear(start - earlierLater, inst.options.earlierText);
            }
            for (y = start; y <= end; y++) {
              addYear(y);
            }
            if (!maxDate || maxDate.year() > end) {
              addYear(end + earlierLater, inst.options.laterText);
            }
          } else {
            start = (maxDate && maxDate.compareTo(start) === -1 ? maxDate : start).year();
            end = (minDate && minDate.compareTo(end) === 1 ? minDate : end).year();
            earlierLater = Math.floor((start - end) / 2);
            if (!maxDate || maxDate.year() > start) {
              addYear(start + earlierLater, inst.options.earlierText);
            }
            for (y = start; y >= end; y--) {
              addYear(y);
            }
            if (!minDate || minDate.year() < end) {
              addYear(end - earlierLater, inst.options.laterText);
            }
          }
          selector += "</select>";
        }
        html = html.replace(/\\x2F/, selector);
        return html;
      },
      _prepare: function(text, inst) {
        var replaceSection = function(type, retain) {
          while (true) {
            var start = text.indexOf("{" + type + ":start}");
            if (start === -1) {
              return;
            }
            var end = text.substring(start).indexOf("{" + type + ":end}");
            if (end > -1) {
              text = text.substring(0, start) + (retain ? text.substr(start + type.length + 8, end - type.length - 8) : "") + text.substring(start + end + type.length + 6);
            }
          }
        };
        replaceSection("inline", inst.inline);
        replaceSection("popup", !inst.inline);
        var pattern = /\{l10n:([^\}]+)\}/;
        var matches = pattern.exec(text);
        while (matches) {
          text = text.replace(matches[0], inst.options[matches[1]]);
          matches = pattern.exec(text);
        }
        return text;
      }
    });
    var plugin = $2.calendarsPicker;
    $2(function() {
      $2(document).on("mousedown." + pluginName, plugin._checkExternalClick).on("resize." + pluginName, function() {
        plugin.hide(plugin.curInst);
      });
    });
  })(jQuery);

  // ../islamic_calendar/islamic_calendar/public/js/custom_control_date.js
  var TYPE_DATE = "date";
  var TYPE_DATETIME = "datetime";
  var ISM_DATE_FORMAT = frappe.boot["islamic_date_datepicker_format"] || "mm-dd-yyyy";
  var ISM_DATE_FORMAT_USER = frappe.boot["islamic_date_format"] || "mm-dd-yyyy";
  var datetime_str_to_user = frappe.datetime.str_to_user;
  var frappeDateFormatter = frappe.form.formatters.Date;
  var frappeDatetimeFormatter = frappe.form.formatters.Datetime;
  function getISMCalendar() {
    return $.calendars.instance("iranian", "en_US");
  }
  function ad2ism(m, type, dateFormat = ISM_DATE_FORMAT) {
    if (!m) {
      return null;
    }
    if (m.year() > 2076) {
      return false;
    }
    return ad2ism_date(m, type).formatDate(dateFormat);
  }
  function ad2ism_date(m, type = TYPE_DATE) {
    let adDate;
    if (type == TYPE_DATETIME) {
      adDate = moment(m.clone().toDate(), "YYYY-MM-DD HH:mm:ss").utc().toDate();
    } else {
      adDate = m.toDate();
    }
    return getISMCalendar().fromJSDate(adDate);
  }
  function FormatFormDate(value2) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDateFormatter(value2);
    if (!formatted) {
      return formatted;
    }
    const date = frappe.datetime.str_to_obj(value2);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATE, ISM_DATE_FORMAT_USER);
    return formatted + "<br />" + ism_date_formatted;
  }
  function FormatFormDatetime(value2) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDatetimeFormatter(value2);
    if (!formatted) {
      return formatted;
    }
    const date = frappe.datetime.str_to_obj(value2);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATETIME, ISM_DATE_FORMAT_USER);
    return formatted + "<br />" + ism_date_formatted;
  }
  frappe.form.formatters.Date = FormatFormDate;
  frappe.form.formatters.Datetime = FormatFormDatetime;
  frappe.ui.form.ControlDate = class CustomControlDate extends frappe.ui.form.ControlDate {
    make_input() {
      this.datepicker_ism = true;
      super.make_input();
      this.$ismInput = this.$input.clone();
      this.$ismInput.addClass("hide");
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
      this.$wrapper.on("click", ".isd_switch_btn", (ev) => {
        event.preventDefault();
        event.stopPropagation();
        this.datepicker_ism = !this.datepicker_ism;
        this._toggleDatepicker();
      });
    }
    _toggleDatepicker() {
      if (!this.$ismInput || !this.$ismInput.length) {
        return;
      }
      if (this.datepicker_ism === true) {
        this.$ismInput.removeClass("hide");
        this.$input.addClass("hide");
      } else {
        this.$input.removeClass("hide");
        this.$ismInput.addClass("hide");
      }
      this._printDateConversion();
    }
    islamic_make_picker() {
      $(this.$ismInput).removeAttr("readonly");
      this.$input.after(this.$ismInput);
      this.$ismInput.calendarsPicker("destroy");
      this.$ismInput.calendarsPicker({
        calendar: getISMCalendar(),
        dateFormat: ISM_DATE_FORMAT,
        prevText: "Prev",
        nextText: "Next",
        todayText: "Today",
        clearText: "Clear",
        closeText: "Close",
        onShow: function(picker) {
          $(picker).find(".calendars-cmd-today").on("click", function() {
            const calendar = $.calendars.instance("islamic", "en_US");
            const today = calendar.newDate();
            this.$ismInput.calendarsPicker("setDate", today);
          }.bind(this));
        }.bind(this),
        onSelect: this.onISMDateSelect.bind(this),
        onClose: this.onISMDatepickerClose.bind(this)
      });
    }
    onISMDateSelect([cdate]) {
      let currentValue = this.get_value();
      let timeInfo;
      if (currentValue) {
        const dateTime = moment(frappe.datetime.str_to_obj(currentValue));
        timeInfo = {
          hours: dateTime.hours(),
          minutes: dateTime.minutes(),
          seconds: dateTime.seconds()
        };
      }
      let selected_date = cdate && moment(cdate.toJSDate()) || void 0;
      if (selected_date && timeInfo) {
        selected_date.set(timeInfo);
      }
      if (selected_date && moment(this.get_value(), this.date_format).isSame(selected_date)) {
        return;
      }
      this.set_value(selected_date.format(this.date_format));
    }
    onISMDatepickerClose([cdate]) {
      this.onISMDateSelect([cdate]);
      this.$ismInput.blur();
    }
    _printDateConversion() {
      let value2 = this.get_value();
      let dateType;
      if (this.df.fieldtype === "Date") {
        dateType = TYPE_DATE;
      } else if (this.df.fieldtype === "Datetime") {
        dateType = TYPE_DATETIME;
      }
      if (!this.can_write()) {
        this.$wrapper.find(".islamic_date-conversion").html("&nbsp;");
        return;
      }
      if (!value2) {
        this.$wrapper.find(".islamic_date-conversion").html("&nbsp;");
      } else {
        if (this.datepicker_ism) {
          this.$wrapper.find(".islamic_date-conversion").html(this.format_for_input(value2));
        } else {
          const selectedDate = moment(value2, this.date_format);
          this.$wrapper.find(".islamic_date-conversion").html(
            ad2ism(selectedDate, dateType, ISM_DATE_FORMAT_USER)
          );
        }
      }
    }
    set_formatted_input(value2) {
      const spset = super.set_formatted_input(value2);
      if (value2) {
        let m = moment(frappe.datetime.str_to_obj(value2));
        this.$ismInput.val(ad2ism(m) || "");
      } else {
        this.$ismInput.val("");
      }
      this._printDateConversion();
      return spset;
    }
    refresh() {
      super.refresh();
      this._printDateConversion();
      if (!this.can_write()) {
        this.$wrapper.find(".ism_switch_btn").css("display", "none");
      } else {
        this.$wrapper.find(".ism_switch_btn").css("display", "block");
      }
    }
  };
  frappe.ui.form.ControlDatetime = class CustomControlDateDate extends frappe.ui.form.ControlDatetime {
    make_input() {
      this.datepicker_ism = true;
      super.make_input();
      this.$ismInput = this.$input.clone();
      this.$ismInput.addClass("hide");
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
      this.$wrapper.on("click", ".isd_switch_btn", (ev) => {
        event.preventDefault();
        event.stopPropagation();
        this.datepicker_ism = !this.datepicker_ism;
        this._toggleDatepicker();
      });
    }
    _toggleDatepicker() {
      if (!this.$ismInput || !this.$ismInput.length) {
        return;
      }
      if (this.datepicker_ism === true) {
        this.$ismInput.removeClass("hide");
        this.$input.addClass("hide");
      } else {
        this.$input.removeClass("hide");
        this.$ismInput.addClass("hide");
      }
      this._printDateConversion();
    }
    islamic_make_picker() {
      $(this.$ismInput).removeAttr("readonly");
      this.$input.after(this.$ismInput);
      this.$ismInput.calendarsPicker("destroy");
      this.$ismInput.calendarsPicker({
        calendar: getISMCalendar(),
        dateFormat: ISM_DATE_FORMAT,
        prevText: "Prev",
        nextText: "Next",
        todayText: "Today",
        i: "Clear",
        closeText: "Close",
        onShow: function(picker) {
          $(picker).find(".calendars-cmd-today").on("click", function() {
            const calendar = $.calendars.instance("islamic", "en_US");
            const today = calendar.newDate();
            this.$ismInput.calendarsPicker("setDate", today);
          }.bind(this));
        }.bind(this),
        onSelect: this.onISMDateSelect.bind(this),
        onClose: this.onISMDatepickerClose.bind(this)
      });
    }
    onISMDateSelect([cdate]) {
      let currentValue = this.get_value();
      let timeInfo;
      if (currentValue) {
        const dateTime = moment(frappe.datetime.str_to_obj(currentValue));
        timeInfo = {
          hours: dateTime.hours(),
          minutes: dateTime.minutes(),
          seconds: dateTime.seconds()
        };
      }
      let selected_date = cdate && moment(cdate.toJSDate()) || void 0;
      if (selected_date && timeInfo) {
        selected_date.set(timeInfo);
      }
      if (selected_date && moment(this.get_value(), this.date_format).isSame(selected_date)) {
        return;
      }
      this.set_value(selected_date.format(this.date_format));
    }
    onISMDatepickerClose([cdate]) {
      this.onISMDateSelect([cdate]);
      this.$ismInput.blur();
    }
    _printDateConversion() {
      let value2 = this.get_value();
      let dateType;
      if (this.df.fieldtype === "Date") {
        dateType = TYPE_DATE;
      } else if (this.df.fieldtype === "Datetime") {
        dateType = TYPE_DATETIME;
      }
      if (!this.can_write()) {
        this.$wrapper.find(".islamic_date-conversion").html("&nbsp;");
        return;
      }
      if (!value2) {
        this.$wrapper.find(".islamic_date-conversion").html("&nbsp;");
      } else {
        if (this.datepicker_ism) {
          this.$wrapper.find(".islamic_date-conversion").html(this.format_for_input(value2));
        } else {
          const selectedDate = moment(value2, this.date_format);
          this.$wrapper.find(".islamic_date-conversion").html(
            ad2ism(selectedDate, dateType, ISM_DATE_FORMAT_USER)
          );
        }
      }
    }
    set_formatted_input(value2) {
      const spset = super.set_formatted_input(value2);
      if (value2) {
        let m = moment(frappe.datetime.str_to_obj(value2));
        this.$ismInput.val(ad2ism(m) || "");
      } else {
        this.$ismInput.val("");
      }
      this._printDateConversion();
      return spset;
    }
    refresh() {
      super.refresh();
      this._printDateConversion();
      if (!this.can_write()) {
        this.$wrapper.find(".ism_switch_btn").css("display", "none");
      } else {
        this.$wrapper.find(".ism_switch_btn").css("display", "block");
      }
    }
  };
  function ReportFormatFormDate(value2) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDateFormatter(value2);
    if (!formatted) {
      return formatted;
    }
    const date = frappe.datetime.str_to_obj(value2);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATE, ISM_DATE_FORMAT_USER);
    return formatted + "<br />" + ism_date_formatted;
  }
  function ReportFormatFormDatetime(value2) {
    frappe.datetime.str_to_user = datetime_str_to_user;
    const formatted = frappeDatetimeFormatter(value2);
    if (!formatted) {
      return formatted;
    }
    const date = frappe.datetime.str_to_obj(value2);
    const ism_date_formatted = ad2ism(moment(date), TYPE_DATETIME, ISM_DATE_FORMAT_USER);
    return formatted + "<br />" + ism_date_formatted;
  }
  var CustomDataTable = class extends DataTable {
    initializeComponents() {
      super.initializeComponents();
      const originalsetColumnHeaderWidth = this.columnmanager.setColumnHeaderWidth;
      const originalsetColumnWidth = this.columnmanager.setColumnWidth;
      this.columnmanager.setColumnHeaderWidth = function(colIndex) {
        originalsetColumnHeaderWidth.call(this, colIndex);
        var column = this.getColumn(colIndex);
        if (["Datetime", "Date"].includes(column.fieldtype)) {
          let $column = this.$columnMap[colIndex];
          $column.style.width = "300px";
        }
      };
      this.columnmanager.setColumnWidth = function(colIndex, width) {
        var column = this.getColumn(colIndex);
        if (["Datetime", "Date"].includes(column.fieldtype)) {
          width = "300";
        }
        originalsetColumnWidth.call(this, colIndex, width);
      };
      const originalgetCellContent = this.cellmanager.getCellContent;
      this.cellmanager.getCellContent = function(cell, refreshHtml = false) {
        var hcontent = originalgetCellContent.call(this, cell, refreshHtml);
        if (!cell.isHeader && !cell.isFilter && cell.column && cell.column.fieldtype != void 0 && ["Date", "Datetime"].includes(cell.column.fieldtype) && cell.content != void 0) {
          if (cell.column.fieldtype == "Date") {
            cell.html = ReportFormatFormDate(cell.content);
          }
          if (cell.column.fieldtype == "Datetime") {
            cell.html = ReportFormatFormDatetime(cell.content);
          }
          hcontent = originalgetCellContent.call(this, cell, refreshHtml);
        }
        return hcontent;
      };
    }
  };
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
          cellHeight: 47
        });
        this.datatable.prepare();
        this.datatable.initializeComponents();
        this.datatable.refresh(this.data, columns);
      }
    }
  };
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
          }
        },
        hooks: {
          columnTotal: frappe.utils.report_column_total
        },
        headerDropdown: [
          {
            label: __("Add Column"),
            action: (datatabe_col) => {
              let columns_in_picker = [];
              const columns = this.get_columns_for_picker();
              columns_in_picker = columns[this.doctype].filter((df) => !this.is_column_added(df)).map((df) => ({
                label: __(df.label, null, df.parent),
                value: df.fieldname
              }));
              delete columns[this.doctype];
              for (let cdt in columns) {
                columns[cdt].filter((df) => !this.is_column_added(df)).map((df) => ({
                  label: __(df.label, null, df.parent) + ` (${cdt})`,
                  value: df.fieldname + "," + cdt
                })).forEach((df) => columns_in_picker.push(df));
              }
              const d = new frappe.ui.Dialog({
                title: __("Add Column"),
                fields: [
                  {
                    label: __("Select Column"),
                    fieldname: "column",
                    fieldtype: "Autocomplete",
                    options: columns_in_picker
                  },
                  {
                    label: __("Insert Column Before {0}", [
                      __(datatabe_col.docfield.label).bold()
                    ]),
                    fieldname: "insert_before",
                    fieldtype: "Check"
                  }
                ],
                primary_action: ({ column, insert_before }) => {
                  if (!columns_in_picker.map((col) => col.value).includes(column)) {
                    frappe.show_alert({
                      message: __("Invalid column"),
                      indicator: "orange"
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
                }
              });
              d.show();
            }
          }
        ]
      });
    }
  };
})();
/*! Abstract base class for collection plugins v1.0.2.
	Written by Keith Wood (wood.keith{at}optusnet.com.au) December 2013.
	Licensed under the MIT license (http://keith-wood.name/licence.html). */
/*! Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
//# sourceMappingURL=islamic_assets.bundle.YPPE75UU.js.map
