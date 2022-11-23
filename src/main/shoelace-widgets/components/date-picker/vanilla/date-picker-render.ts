import { Calendar } from './calendar';
import { DatePickerController } from './date-picker-controller';
import { CalendarLocalizer } from './calendar-localizer';
import { h } from './vdom';

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

export { renderDatePicker };

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
) {
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

    const sheet =
      view === 'century'
        ? renderCenturySheet()
        : view === 'decade'
        ? renderDecadeSheet()
        : view === 'year'
        ? renderYearSheet()
        : renderMonthSheet();

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
                'class': 'cal-prev',
                'data-subject': 'prev'
              },
              i18n.getDirection() === 'ltr' ? '\u{1F860}' : '\u{1F862}'
            ),
            renderTitle(),
            a(
              {
                'class': 'cal-next',
                'data-subject': 'next'
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

  function renderMonthSheet() {
    const view = calendar.getMonthView(
      datePickerCtrl.getActiveYear(),
      datePickerCtrl.getActiveMonth()
    );

    return div(
      {
        class: classMap({
          'cal-sheet': true,
          'cal-sheet--month': true,
          'cal-sheet--month-with-week-numbers': props.showWeekNumbers
        })
      },

      props.showWeekNumbers ? div() : null,
      view.weekdays.map((idx) =>
        div({ class: 'cal-weekday' }, i18n.getWeekdayName(idx, 'short'))
      ),
      view.days.flatMap((dayData, idx) => {
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

  function renderDayCell(dayData: Calendar.DayData) {
    const currentHighlighted = props.highlightToday && dayData.current;
    const highlighted = props.highlightWeekends && dayData.weekend;

    if (props.daysAmount === 'minimal' && dayData.adjacent) {
      return div({
        class: classMap({
          'cal-cell--highlighted': highlighted
        })
      });
    }

    const weekString = getYearWeekString(
      dayData.calendarWeek.year,
      dayData.calendarWeek.week
    );

    const selected =
      datePickerCtrl.hasSelectedDay(
        dayData.year,
        dayData.month,
        dayData.day,
        weekString
      ) && !dayData.disabled;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': dayData.disabled,
          'cal-cell--adjacent': dayData.adjacent,
          'cal-cell--current': dayData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--highlighted': highlighted,
          'cal-cell--selected': selected
        }),
        'data-date': getYearMonthDayString(
          dayData.year,
          dayData.month,
          dayData.day
        ),
        'data-week': weekString,
        'data-subject': dayData.disabled ? null : 'day'
      },
      i18n.formatDay(dayData.day)
    );
  }

  function renderYearSheet() {
    const view = calendar.getYearView(datePickerCtrl.getActiveYear());

    return div(
      { class: 'cal-sheet cal-sheet--year' },
      view.months.map((monthData) => renderMonthCell(monthData))
    );
  }

  function renderMonthCell(monthData: Calendar.MonthData) {
    const selected = datePickerCtrl.hasSelectedMonth(
      monthData.year,
      monthData.month
    );

    const currentHighlighted = monthData.current && props.highlightToday;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': monthData.disabled,
          'cal-cell--current': monthData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        }),
        'data-month': getYearMonthString(monthData.year, monthData.month),
        'data-subject': monthData.disabled ? null : 'month'
      },
      i18n.getMonthName(monthData.month, 'short')
    );
  }

  function renderDecadeSheet() {
    const view = calendar.getDecadeView(datePickerCtrl.getActiveYear());

    return div(
      { class: 'cal-sheet cal-sheet--decade' },
      view.years.map((monthData, idx) => renderYearCell(monthData))
    );
  }

  function renderYearCell(yearData: Calendar.YearData) {
    const selected = datePickerCtrl.hasSelectedYear(yearData.year);
    const currentHighlighted = props.highlightToday && yearData.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': yearData.disabled,
          'cal-cell--current': yearData.current,
          'cal-cell--current-highlighted': currentHighlighted,
          'cal-cell--selected': selected
        }),
        'data-year': getYearString(yearData.year),
        'data-subject': yearData.disabled ? null : 'year'
      },
      i18n.formatYear(yearData.year)
    );
  }

  function renderCenturySheet() {
    const view = calendar.getCenturyView(datePickerCtrl.getActiveYear());

    return div(
      { class: 'cal-sheet cal-sheet--century' },
      view.decades.map((decadeData, idx) => renderDecadeCell(decadeData))
    );
  }

  function renderDecadeCell(decadeData: Calendar.DecadeData) {
    const currentHighlighted = props.highlightToday && decadeData.current;

    return div(
      {
        'class': classMap({
          'cal-cell': true,
          'cal-cell--disabled': decadeData.disabled,
          'cal-cell--current': decadeData.current,
          'cal-cell--current-highlighted': currentHighlighted
        }),
        'data-year': getYearString(decadeData.firstYear),
        'data-subject': decadeData.disabled ? null : 'decade'
      },
      i18n
        .getDecadeTitle(decadeData.firstYear, 10)
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