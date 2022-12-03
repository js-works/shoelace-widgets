export default /*css*/ `
  .cal-base {
    display: flex;
    flex-direction: column;
    color: var(--cal-color);
    background-color: var(--cal-background-color);
    font-family: var(--cal-font-family);
    font-size: var(--cal-font-size);
    user-select: none;
  }

  .cal-view--calendar {
    min-height: 14em;
  }

  .cal-base * {
    box-spacing: border-box;
  }

  /* calendar sheet and sheet header */

  .cal-header {
    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: stretch;
    color: var(--cal-nav-color);
    background-color: var(--cal-nav-active-background-color);
  }

  .cal-header--accentuated {
    color: var(--cal-header-accentuated-color);
    background-color: var(--cal-header-accentuated-background-color);
  }

  .cal-header--accentuated
    > :where(
      .cal-title:not(.cal-title--disabled),
      .cal-prev:not(.cal-prev--disabled),
      .cal-next:not(.cal-next--disabled)
    ) {
    cursor: pointer;
  }

  .cal-header--accentuated
    > :where(
      .cal-title:not(.cal-title--disabled),
      .cal-prev:not(.cal-prev--disabled),
      .cal-next:not(.cal-next--disabled)
    ):hover {
    color: var(--cal-header-accentuated-hover-color);
    background-color: var(--cal-header-accentuated-hover-background-color);
  }

  .cal-header--accentuated
    > :where(
      .cal-title:not(.cal-title--disabled),
      .cal-prev:not(.cal-prev--disabled),
      .cal-next:not(.cal-next--disabled)
    ):active {
    color: var(--cal-header-accentuated-active-color);
    background-color: var(--cal-header-accentuated-active-background-color);
  }

  .cal-title {
    text-align: center;
  }

  .cal-title,
  .cal-prev,
  .cal-next {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.25em 0.5em;
  }

  .cal-prev--disabled,
  .cal-next--disabled {
    visibility: hidden;
  }

  .cal-sheet {
    display: grid;
    grid-template-rows: auto;
    align-items: stretch;
    flex-grow: 1;
    padding: 0.25em;
  }

  .cal-column-name {
    text-align: center;
    padding: 0.5em;
    font-size: 90%;
  }

  .cal-column-name--highlighted {
    background-color: var(--cal-cell-highlighted-background-color);
  }

  .cal-row-name {
    text-align: center;
    min-width: 1.5em;
    font-size: 75%;
    opacity: 80%;
  }

  .cal-cell-container {
    display: flex;
    flex-grow: 1;
    grow: 1;
    align-items: stretch;
    justify-items: stretch;
    justify-content: stretch;
  }

  .cal-cell-container--highlighted {
    background-color: var(--cal-cell-highlighted-background-color);
  }

  .cal-cell {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    justify-items: stretch;
    padding: 0.125em 0.75em;
    text-transform: capitalize;
    hyphens: auto;
  }

  .cal-cell:not(.cal-cell--disabled):not(.cal-cell--selected):hover {
    color: var(--cal-cell-hover-color);
    background-color: var(--cal-cell-hover-background-color);
  }

  .cal-cell:not(.cal-cell--disabled) {
    cursor: pointer;
  }

  .cal-cell--selected:not(.cal-cell--disabled) {
    color: var(--cal-cell-selected-color);
    background-color: var(--cal-cell-selected-background-color);
  }

  .cal-cell--selected:not(.cal-cell--disabled):hover {
    background-color: var(--cal-cell-selected-hover-background-color);
  }

  .cal-cell--disabled {
    cursor: not-allowed;
  }

  .cal-cell--disabled.cal-cell--adjacent {
    opacity: 10%;
  }

  .cal-cell--adjacent:not(.cal-cell--disabled):not(.cal-cell--selected) {
    color: var(--cal-cell-adjacent-color);
  }

  .cal-cell--adjacent.cal-cell--selected {
    color: var(--cal-cell-adjacent-selected-color);
  }

  .cal-cell--adjacent.cal-cell--disabled {
    color: var(--cal-cell-adjacent-disable-color);
  }

  .cal-cell--current:not(.cal-cell-selected):not(:hover) {
    background-color: var(--cal-cell-current-highlighted-background-color);
  }

  .cal-cell--in-selection-range:not(.cal-cell--selected) {
    background-color: var(--cal-cell-selection-range-background-color);
  }

  .cal-cell--first-in-selection-range:not(.cal-cell--last-in-selection-range) {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .cal-cell--last-in-selection-range:not(.cal-cell--first-in-selection-range) {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  /* time links */

  .cal-time-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 0 3em;
    min-height: 2em;
    box-sizing: border-box;
    margin: 0.5em;
  }

  .cal-time-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
  }

  .cal-time-link--disabled {
    pointer-events: none;
  }

  .cal-time-link:first-child {
    grid-column: 1;
    justify-self: start;
  }

  .cal-time-link:nth-child(2) {
    justify-self: end;
    grid-column: 2;
  }

  /* time view */

  .cal-view--time {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    padding: 0.5em 1em;
  }

  /* time */

  .cal-time {
    margin: 0.5rem 0 0 0;
  }

  .cal-time-header {
    font-size: calc(100% - 1px);
    margin-bottom: 0.25em;
    font-weight: 200;
  }

  .cal-time-value {
    font-size: 150%;
  }

  /* time tabs */

  .cal-time-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .cal-time-tabs > .cal-time {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    white-space: nowrap;
  }

  .cal-time-tabs > .cal-time:only-child {
    text-align: center;
    grid-column: span 2;
  }

  .cal-time-tabs--active-tab-time1 > .cal-time:first-child,
  .cal-time-tabs--active-tab-time2 > .cal-time:nth-child(2) {
    pointer-events: none;
  }

  .cal-time-tabs--active-tab-time1 > .cal-time:nth-child(2):hover,
  .cal-time-tabs--active-tab-time2 > .cal-time:first-child:hover {
    cursor: pointer;
    background-color: var(--cal-tab-hover-background-color);
  }

  .cal-time-tabs--active-tab-time1 > .cal-time:nth-child(2) {
    font-size: 70%;
    border-width: 0 0 1px 1px;
    border: 0 solid var(--cal-border-color);
    border-width: 0 0 1px 1px;
    white-space: nowrap;
    padding: 1em 2em;
  }

  .cal-time-tabs > .cal-time:nth-child(2) {
    padding-left: 1em;
  }
  
  .cal-time-tabs--active-tab-time2 > .cal-time:first-child {
    font-size: 70%;
    border: 0 solid var(--cal-border-color);
    border-width: 0 1px 1px 0;
    white-space: nowrap;
    padding: 1em 2em;
  }

  /* back to month link */

  .cal-back-to-month-link {
    display: block;
    padding: 0.5em 2em;
    text-align: center;
    background-color: var(--cal-back-link-background-color);
    border-radius: var(--cal-back-link-border-radius, 3px);
    cursor: pointer;
  }

  .cal-back-to-month-link:hover {
    background-color: var(--cal-back-link-hover-background-color);
  }

  .cal-back-to-month-link:active {
    background-color: var(--cal-back-link-active-background-color);
  }

  /* time sliders */

  .cal-time-sliders {
    display: grid;
    grid-template-columns: min-content auto;
    gap: 0 1em;
  }

  .time-slider-headline {
  }

  /* time slider */

  .cal-time-slider {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    height: 0.75px;
    width: 100%;
    margin: 1em 0;

    background-image: linear-gradient(
      var(--cal-slider-track-color),
      var(--cal-slider-track-color)
    );

    background-position: 0 50%;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    box-sizing: border-box;
    cursor: pointer;
    background-color: var(--cal-background-color);
  }

  .cal-time-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.25em;
    width: 1.25em;
    border-radius: var(--cal-slider-thumb-border-radius);
    background-color: var(--cal-slider-thumb-background-color);
    border: var(--cal-slider-thumb-border-width) solid
      var(--cal-slider-thumb-border-color);
  }

  .cal-time-slider::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.25em;
    width: 1.25em;
    border-radius: var(--cal-slider-thumb-border-radius);
    background-color: var(--cal-slider-thumb-background-color);
    border: var(--cal-slider-thumb-border-width) solid
      var(--cal-slider-thumb-border-color);
  }

  .cal-time-slider::-webkit-slider-thumb:hover {
    background-color: var(--cal-slider-thumb-hover-background-color);
    border-color: var(--cal-slider-thumb-hover-border-color);
  }

  .cal-time-slider::-moz-range-thumb:hover {
    background-color: var(--cal-slider-thumb-hover-background-color);
    border-color: var(--cal-slider-thumb-hover-border-color);
  }

  .cal-time-slider:focus::-webkit-slider-thumb {
    background-color: var(--cal-slider-thumb-focus-background-color);
    border-color: var(--cal-slider-thumb-focus-border-color);
  }

  .cal-time-slider:focus::-moz-range-thumb {
    background-color: var(--cal-slider-thumb-focus-background-color);
    border-color: var(--cal-slider-thumb-focus-border-color);
  }

  .cal-time-slider::-webkit-slider-runnable-track,
  .cal-time-slider::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
`;
