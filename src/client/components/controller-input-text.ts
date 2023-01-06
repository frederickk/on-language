import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

// @ts-ignore
import Style from './controller-input-text.scss';

@customElement('input-text')
export class InputText extends LitElement {
  /** Has the user clicked the input? */
  private clickEnter_: boolean = false;

  /** Timeout time handler. */
  private timeout_?: number;

  constructor() {
    super();
  }

  static get styles() {
		return [Style];
  }

  @property({type: Number})
  delay = 3000;

  @property({type: Boolean})
  disabled = false;

  @property({type: Boolean})
  error = false;

  @property({type: String})
  placeholder = '';

  @property({type: String})
  value = '';

  @query('input.input')
  input_!: HTMLInputElement;

  render() {
    return html `
      <input
        class="input ${(this.error)?'input--error':''}"
        type="text"
        .placeholder="${this.placeholder}"
        .value="${this.value}"
        ?disabled=${this.disabled}
        ?error=${this.error}
        @blur="${this.handlerInput_}"
        @click="${this.handlerKeydown_}"
        @input="${this.handlerInput_}"
        @keydown="${this.handlerKeydown_}"
        @keyup="${this.handlerKeyup_}"/>
    `;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.get('value')) {
      if (this.isEmpty_()) {
        this.clickEnter_ = false;
      }
    }
  }

  /** Handles 'input' event and fires 'empty' event if value is null. */
  protected handlerInput_() {
    this.value = this.input_.value;

    if (this.isEmpty_()) {
      this.clickEnter_ = false;
      const event = new CustomEvent('empty', {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  /** Handles 'keydown' events and fires 'enter' event. */
  protected handlerKeydown_(event: KeyboardEvent) {
    this.handlerKeySubmit_(event);

    if (!this.clickEnter_) {
      this.clickEnter_ = true;
      const event = new CustomEvent('enter', {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  /** Handles 'keyup' events and fires 'timeout' event. */
  protected handlerKeyup_() {
    if (!this.timeout_) {
      this.timeout_ = window.setTimeout(() => {
        if (this.isEmpty_()) {
          this.clickEnter_ = false;
        }
        const event = new CustomEvent('timeout', {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
        window.clearTimeout(this.timeout_);
      }, this.delay);
    }
  }

  /** Handles CMD+Enter submission of input handler from user. */
  protected handlerKeySubmit_(event: KeyboardEvent) {
    // TODO: Fix to not rely on keyCode.
    if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
      const event = new CustomEvent('submit', {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  /** Returns true if input is empty. */
  protected isEmpty_() {
    return (this.input_.value.trim() === '' || this.input_.value == null);
  }
}

