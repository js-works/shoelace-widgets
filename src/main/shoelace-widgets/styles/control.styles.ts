import { css, unsafeCSS } from 'lit';

export default css`
  .sl-control {
    margin: 4px 0;
  }

  .form-control,
  .sl-control::part(form-control) {
    display: flex;
    flex-direction: var(--label-layout-direction, column);
    align-items: var(--label-layout-justify, stretch);
    gap: var(--label-layout-gap, 0);
  }

  .form-control-label,
  .sl-control::part(form-control-label) {
    flex: 0 0 auto;
    width: var(--label-layout-width, auto);
    text-align: var(--label-layout-placement, start);
    margin: 2px 0;
  }

  .form-control-input,
  .sl-control::part(form-control-input) {
    flex: 1 1 auto;

    /*
    margin: var(--label-layout-vertical, 0 0 0.4rem 0)
      var(--label-layout-horizontal, 2px 0);
    */
  }

  .form-control-label--required:after,
  .sl-control-label--required::after {
    xxxfont-family: var(--sl-font-mono);
    font-size: var(--sl-font-size-medium);
    position: relative;
    top: -2px;
    margin: 0 calc(-1.5ch) 0 0;
    left: calc(-0.5ch + 2px);
    width: 1ex;
    max-width: 1ex;
    overflow: hidden;
    content: var(--sl-input-required-content);
    color: var(--sl-input-required-content-color);
    box-sizing: border-box;
  }

  .form-control-label {
    align-self: var(--label-layout-justify, stretch);
  }

  /* -------------------------------------------------------------- */

  .validation-error:not(:empty)::before {
    content: '\\0026a0\\00fe0e \\00a0';
    color: var(--sl-color-danger-800);
    font-family: 'monospace';
  }

  .validation-error:not(:empty) {
    xxxposition: absolute;

    font-size: 90%;
    color: var(--sl-color-danger-800);
    padding: 0 0.5rem 0.375rem 0;

    margin: 0 0 0 calc(var(--label-layout-width) + var(--label-layout-gap));
  }

  .base.invalid sl-input::part(base),
  .base.invalid sl-select::part(control) {
    background-color: var(--sl-color-neutral-0);
  }

  .form-control-label,
  .validation-error:not(:empty),
  sl-input::part(form-control-label),
  sl-select::part(form-control-label) {
    xxxfont-weight: 600;
  }

  .base.invalid sl-input::part(form-control-label),
  .base.invalid sl-select::part(form-control-label) {
    xxxcolor: var(--sl-color-danger-800);
  }

  .base.invalid sl-input::part(base),
  .base.invalid sl-select::part(control) {
    border-color: var(--sl-color-danger-800);
    background-color: var(--sl-color-danger-50);

    --sl-input-focus-ring-color: var(--sl-color-danger-400);
  }
`;
