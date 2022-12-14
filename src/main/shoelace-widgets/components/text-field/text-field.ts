import { html, LitElement, ReactiveControllerHost } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LocalizeController } from '../../i18n/i18n';

interface FormField extends HTMLElement, ReactiveControllerHost {
  checkValidity(): boolean;
  reportValidity(): boolean;
  disabled: boolean;
  value: string;
  defaultValue: string;
  required: boolean;
  checkValidity: () => boolean;
  reportValidity: () => boolean;
  setCustomValidity: (message: string) => void;
}

/*
import {
  FormFieldController,
  Validators
} from '../../form-fields/form-field-controller';
*/

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';

// styles
import textFieldStyles from './text-field.styles';
import { FormFieldController } from '../../form-fields/form-field-controller';

// === exports =======================================================

export { TextField };

// === types =========================================================

declare global {
  interface HTMLElementTagNameMap {
    'sx-text-field': TextField;
  }
}

/*
class FormFieldController {
  #formField: FormField
  #formSubmitCtrl: FormSubmitController

  constructor(formField: FormField) {
    this.#formField = formField
    this.#formSubmitCtrl = new FormSubmitController(formField)
  }
}
*/

// === TextField =====================================================

@customElement('sx-text-field')
class TextField extends LitElement implements FormField {
  static styles = textFieldStyles;

  static {
    // dependencies (to prevent too much tree shaking)
    void [SlIcon, SlInput];
  }

  @property()
  type: 'text' | 'password' | 'email' | 'phone' | 'cellphone' = 'text';

  @property()
  name = '';

  @property()
  value = '';

  @property()
  defaultValue = '';

  @property()
  label = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean, reflect: true })
  autofocus = false;

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  private _slInputRef = createRef<SlInput>();
  private _localize = new LocalizeController(this);
  private _formFieldCtrl = new FormFieldController(this);

  /*
  private _formField = new FormFieldController(this, {
    getValue: () => this.value,
    validation: [
      Validators.required((value) => !this.required || !!value),
      (value) => (this.type !== 'email' ? null : Validators.email()(value))
    ]
  });
  */

  focus() {
    this._slInputRef.value!.focus();
  }

  blur(): void {
    this._slInputRef.value?.blur();
  }

  protected override firstUpdated() {
    Object.defineProperty(this, 'value', {
      get: () => this._slInputRef.value!.value,
      set: (value: string) => void (this._slInputRef.value!.value = value)
    });
  }

  /*
  get validationMessage(): string {
    return this._formField.validate() || '';
  }
  */

  /*
  private _onInput = () => this._formField.signalInput();
  private _onChange = () => this._formField.signalChange();
  private _onFocus = () => this._formField.signalFocus();
  private _onBlur = () => this._formField.signalBlur();
  */

  private _onKeyDown = (ev: KeyboardEvent) =>
    void (ev.key === 'Enter' && this._formFieldCtrl.submit());

  render() {
    const icon =
      this.type === 'email' ||
      this.type === 'phone' ||
      this.type === 'cellphone'
        ? `text-field.${this.type}`
        : null;

    return html`
      <div
        class="base ${classMap({
          required: this.required
          // invalid: this._formField.showsError()
        })}"
      >
        <sl-input
          type=${this.type === 'password' ? 'password' : 'text'}
          ?password-toggle=${this.type === 'password'}
          class="sl-control"
          size=${this.size}
          ${ref(this._slInputRef)}
          value=${this.value}
          ?autofocus=${this.autofocus}
          @keydown=${this._onKeyDown}
        >
          ${when(
            this.label,
            () => html`
              <span
                slot="label"
                class=${classMap({
                  'sl-control-label': true,
                  'sl-control-label--required': this.required
                })}
              >
                ${this.label}
              </span>
            `
          )}
          ${when(
            icon,
            () =>
              html`<sl-icon
                slot="suffix"
                library="shoelace-widgets"
                name=${icon}
              ></sl-icon> `
          )}
        </sl-input>
        <!--
        {when(this._formField.getValidationMode() === 'inline', () =>
          this._formField.renderErrorMsg()
        )}
        -->
      </div>
    `;
  }

  checkValidity(): boolean {
    return false; // TODO!!!!
    //    return this._formField.
  }

  reportValidity(): boolean {
    return this.checkValidity();
  }

  setCustomValidity(msg: string) {
    //
  }
}
