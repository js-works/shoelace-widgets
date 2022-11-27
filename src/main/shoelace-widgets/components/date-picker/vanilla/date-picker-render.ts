import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';
import { CalendarLocalizer } from './calendar-localizer';
import { h, VElement, VNode } from './vdom';

const [a, div, input, span] = ['a', 'div', 'input', 'span'].map((tag) =>
  h.bind(null, tag)
);

function classMap(classes: Record<string, unknown>): string {
  const arr: string[] = [];

  for (const key of Object.keys(classes)) {
    if (classes[key]) {
      arr.push(key);
    }
  }

  return arr.join(' ');
}

import {
  getYearMonthDayString,
  getYearMonthString,
  getYearString,
  getYearWeekString
} from './calendar-utils';

// === exports =======================================================

export { renderDatePicker, DatePickerProps };

// === types ===================================================

type DatePickerProps = {
  selectionMode: DatePickerController.SelectionMode;
  elevateNavigation: boolean;
  showWeekNumbers: boolean;
  daysAmount: 'default' | 'minimal' | 'maximal';
  highlightToday: boolean;
  highlightWeekends: boolean;
  disableWeekends: boolean;
  enableCenturyView: boolean;
  minDate: Date | null;
  maxDate: Date | null;
};

// === Calendar ======================================================

function renderDatePicker(
  locale: string,
  direction: 'ltr' | 'rtl',
  props: DatePickerProps,
  datePickerCtrl: DatePickerController
): VElement {
  const i18n = new CalendarLocalizer({
    locale,
    direction
  });

  const calendar = new Calendar({
    firstDayOfWeek: i18n.getFirstDayOfWeek(),
    weekendDays: i18n.getWeekendDays(),
    getCalendarWeek: (date: Date) => i18n.getCalendarWeek(date),
    disableWeekends: props.disableWeekends,
    alwaysShow42Days: props.daysAmount === 'maximal',
    minDate: props.minDate,
    maxDate: props.maxDate
  });

  function render() {
    const view = datePickerCtrl.getView();

    let sheet: VNode = null;
    let prevDisabled = false;
    let nextDisabled = false;

    switch (view) {
      case 'century': {
        const data = calendar.getCenturyData(datePickerCtrl.getActiveYear());
        sheet = renderCenturySheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'decade': {
        const data = calendar.getDecadeData(datePickerCtrl.getActiveYear());
        sheet = renderDecadeSheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'year': {
        const data = calendar.getYearData(datePickerCtrl.getActiveYear());
        sheet = renderYearSheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'month': {
        const data = calendar.getMonthData(
          datePickerCtrl.getActiveYear(),
          datePickerCtrl.getActiveMonth()
        );

        sheet = renderMonthSheet(data);
        prevDisabled = data.prevDisabled;
        nextDisabled = data.nextDisabled;
        break;
      }

      case 'time':
        break;

      default:
        throw new Error(`Illegal view ${view}`);
    }

    // TODO!!!
    const typeSnakeCase = props.selectionMode.replace(
      /[A-Z]/g,
      (it) => `-${it.toLowerCase()}`
    );

    return div(
      { class: `cal-base cal-base--type-${typeSnakeCase}` },
      props.selectionMode === 'time' || props.selectionMode === 'timeRange'
        ? null
        : div(
            {
              class: classMap({
                'cal-nav': true,
                'cal-nav--elevated': props.elevateNavigation
              })
            },
            a(
              {
                'class': classMap({
                  'cal-prev': true,
                  'cal-prev--disabled': prevDisabled
                }),
                'data-subject': prevDisabled ? null : 'prev'
              },
              i18n.getDirection() === 'ltr' ? '\u{1F860}' : '\u{1F862}'
            ),
            renderTitle(),
            a(
              {
                'class': classMap({
                  'cal-next': true,
                  'cal-next--disabled': nextDisabled
                }),
                'data-subject': nextDisabled ? null : 'next'
              },
              i18n.getDirection() === 'ltr' ? '\u{1F862}' : '\u{1F860}'
            )
          ),

      props.selectionMode === 'time' || props.selectionMode === 'timeRange'
        ? null
        : sheet,

      props.selectionMode !== 'dateTime' &&
        props.selectionMode !== 'time' &&
        props.selectionMode !== 'timeRange'
        ? null
        : div(
            null,
            props.selectionMode !== 'timeRange'
              ? null
              : div({ class: 'cal-time-selector-headline' }, 'From'),
            div(
              { class: 'cal-time-selector' },
              div({ class: 'cal-time' }, renderTime()),
              input({
                'type': 'range',
                'class': 'cal-hour-slider',
                'value': datePickerCtrl.getActiveHour(),
                'min': 0,
                'max': 23,
                'data-subject': 'hours'
              }),
              input({
                'type': 'range',
                'class': 'cal-minute-slider',
                'value': datePickerCtrl.getActiveMinute(),
                'min': 0,
                'max': 59,
                'data-subject': 'minutes'
              })
            )
          ),
      props.selectionMode !== 'timeRange'
        ? null
        : div(
            null,
            div({ class: 'cal-time-range-arrow' }, '\u{1F863}'),
            div({ class: 'cal-time-selector-headline' }, 'To'),
            div(
              { class: 'cal-time-selector' },
              div({ class: 'cal-time' }, renderTime(2)),
              input({
                'type': 'range',
                'class': 'cal-hour-slider',
                'value': datePickerCtrl.getActiveHour2(),
                'min': 0,
                'max': 23,
                'data-subject': 'hours2'
              }),
              input({
                'type': 'range',
                'class': 'cal-minute-slider',
                'value': datePickerCtrl.getActiveMinute2(),
                'min': 0,
                'max': 59,
                'data-subject': 'minutes2'
              })
            )
          )
    );
  }

  function renderTitle() {
    const view = datePickerCtrl.getView();
    const activeYear = datePickerCtrl.getActiveYear();

    const title =
      view === 'century'
        ? i18n.getCenturyTitle(activeYear, 12)
        : view === 'decade'
        ? i18n.getDecadeTitle(activeYear, 12)
        : view === 'year'
        ? i18n.getYearTitle(activeYear)
        : i18n.getMonthTitle(activeYear, datePickerCtrl.getActiveMonth());

    const disabled =
      datePickerCtrl.getView() === 'century' ||
      (datePickerCtrl.getView() === 'decade' && !props.enableCenturyView);

    return div(
      {
        'class': classMap({
          'cal-title': true,
          'cal-title--disabled': disabled
        }),
        'data-subject': disabled ? null : 'title'
      },
      title
    );
  }

  function renderMonthSheet(monthData: Calendar.MonthData) {
    return div(
      {
        class: classMap({
          'cal-sheet': true,
          'cal-sheet--month': true,
          'cal-sheet--month-with-week-numbers': props.showWeekNumbers
        })
      },

      props.showWeekNumbers ? div() : null,
      monthData.weekdays.map((idx) =>
        div({ class: 'cal-weekday' }, i18n.getWeekdayName(idx, 'short'))
      ),
      monthData.days.flatMap((dayData, idx) => {
        const cell = renderDayCell(dayData);
        return !props.showWeekNumbers || idx % 7 > 0
          ? cell
          : [
              div(
                { class: 'cal-week-number' },
                i18n.formatWeekNumber(dayData.calendarWeek.week)
              ),
              cell
            ];
      })
    );
  }

  function renderDayCell(dayItem: Calendar.DayItem) {
    const currentHighlighted = props.highlightToday && dayItem.current;
    const highlighted = props.highlightWeekends && dayItem.weekend;

    if (props.daysAmount === 'minimal' && dayItem.adjacent) {
      return div({
        class: classMap({
          'cal-cell--highlighted': highlighted
        })
      });
    }

    const weekString = getYearWeekString(
      dayItem.calendarWeek.year,
      dayItem.calendarWeek.week
    );

    const selected =
      datePickerCtrl.hasSelectedDay(
        dayItem.year,
        dayItem.month,
        dayItem.day,
        weekString
      ) && !dayItem.disabled;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': dayItem.disabled,
          'cal-cell--adjacent': dayItem.adjacent,
          'cal-cell--current': dayItem.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--highlighted': highlighted,
          'cal-cell--selected': selected
        }),
        'data-date': getYearMonthDayString(
          dayItem.year,
          dayItem.month,
          dayItem.day
        ),
        'data-week': weekString,
        'data-subject': dayItem.disabled ? null : 'day'
      },
      i18n.formatDay(dayItem.day)
    );
  }

  function renderYearSheet(yearData: Calendar.YearData) {
    return div(
      { class: 'cal-sheet cal-sheet--year' },
      yearData.months.map((monthData) => renderMonthCell(monthData))
    );
  }

  function renderMonthCell(monthItem: Calendar.MonthItem) {
    const selected = datePickerCtrl.hasSelectedMonth(
      monthItem.year,
      monthItem.month
    );

    const currentHighlighted = monthItem.current && props.highlightToday;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthItem.disabled,
          'cal-cell--current': monthItem.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        }),
        'data-month': getYearMonthString(monthItem.year, monthItem.month),
        'data-subject': monthItem.disabled ? null : 'month'
      },
      i18n.getMonthName(monthItem.month, 'short')
    );
  }

  function renderDecadeSheet(decadeData: Calendar.DecadeData) {
    return div(
      { class: 'cal-sheet cal-sheet--decade' },
      decadeData.years.map((monthData, idx) => renderYearCell(monthData))
    );
  }

  function renderYearCell(yearItem: Calendar.YearItem) {
    const selected = datePickerCtrl.hasSelectedYear(yearItem.year);
    const currentHighlighted = props.highlightToday && yearItem.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearItem.disabled,
          'cal-cell--current': yearItem.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        }),
        'data-year': getYearString(yearItem.year),
        'data-subject': yearItem.disabled ? null : 'year'
      },
      i18n.formatYear(yearItem.year)
    );
  }

  function renderCenturySheet(centuryData: Calendar.CenturyData) {
    return div(
      { class: 'cal-sheet cal-sheet--century' },
      centuryData.decades.map((decadeData, idx) => renderDecadeCell(decadeData))
    );
  }

  function renderDecadeCell(decadeItem: Calendar.DecadeItem) {
    const currentHighlighted = props.highlightToday && decadeItem.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': decadeItem.disabled,
          'cal-cell--current': decadeItem.current,
          'cal-cell--current-highlighted': currentHighlighted
        }),
        'data-year': getYearString(decadeItem.firstYear),
        'data-subject': decadeItem.disabled ? null : 'decade'
      },
      i18n
        .getDecadeTitle(decadeItem.firstYear, 10)
        .replaceAll('\u2013', '\u2013\u200B')
    );
  }

  function renderTime(timeSelectorNumber: 1 | 2 = 1) {
    const date = new Date(
      1970,
      0,
      1,
      timeSelectorNumber !== 2
        ? datePickerCtrl.getActiveHour()
        : datePickerCtrl.getActiveHour2(),
      timeSelectorNumber !== 2
        ? datePickerCtrl.getActiveMinute()
        : datePickerCtrl.getActiveMinute2()
    );
    let time = '';
    let dayPeriod = '';

    const parts = new Intl.DateTimeFormat(i18n.getLocale(), {
      hour: '2-digit',
      minute: '2-digit'
    }).formatToParts(date);

    if (
      parts.length > 4 &&
      parts[parts.length - 1].type === 'dayPeriod' &&
      parts[parts.length - 2].type === 'literal' &&
      parts[parts.length - 2].value === ' '
    ) {
      time = parts
        .slice(0, -2)
        .map((it) => it.value)
        .join('');

      dayPeriod = parts[parts.length - 1].value;
    } else {
      time = parts.map((it) => it.value).join('');
    }

    return div(
      {
        class: classMap({
          'cal-time': true,
          'cal-time--has-day-period': !!dayPeriod
        })
      },
      time,
      !dayPeriod ? null : span({ class: 'cal-day-period' }, dayPeriod)
    );
  }

  return render();
}

// cSpell:words vdom
