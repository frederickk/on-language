/**
 * @fileoverview Simple code editor element with syntax highlighting.
 * Heavily inspired by https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
 */

import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import * as log from '../../globals/log';

// @ts-ignore
import Style from './controller-code-editor.scss';

@customElement('code-editor')
export class CodeEditor extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return [Style];
  }

  @property({type: Boolean})
  clear = true;

  @property({type: String})
  code = '';

  @property({type: String})
  lang = 'js';

  @property({type: Boolean})
  run = false;

  @property({type: Boolean})
  stop = false;

  @property({type: String})
  value = '';

  @query('button-debounce#clear')
  buttonClear_!: HTMLElement;

  @query('button-debounce#run')
  buttonRun_!: HTMLElement;

  @query('code')
  elemCode_!: HTMLElement;

  @query('pre.highlighter')
  elemHighlighter_!: HTMLPreElement;

  @query('textarea.editor')
  elemEditor_!: HTMLTextAreaElement;

  render() {
    return html `
    <div class="actions"
      ?clear=${this.clear}
      ?run=${this.run}
      ?stop=${this.stop}>
      ${this.clear
        ? html `<button-debounce id="clear" class="tooltip--bottom" data-tooltip="Clear" @click="${this.handlerClickClear_}"><span class="material-symbols-outlined">backspace</span></button-debounce>`
        : ``}
      ${this.stop
        ? html `<button-debounce id="stop" class="tooltip--bottom" data-tooltip="Stop" @click="${this.handlerClickStop_}"><span class="material-symbols-outlined">stop</span></button-debounce>`
        : html``}
      ${this.run
        ? html `<button-debounce id="run" class="tooltip--bottom" data-tooltip="Run" @click="${this.handlerClickRun_}"><span class="material-symbols-outlined">play_arrow</span></button-debounce>`
        : html``}
    </div>

    <textarea class="editor"
      placeholder=""
      id="editing"
      spellcheck="false"
      .value="${this.value}"
      @blur="${this.handlerInput_}"
      @input="${this.handlerInput_}"
      @scroll="${this.handlerScrollSync_}"
      @keydown="${this.handlerTabKey_}">
      <slot></slot>
    </textarea>

    <pre class="highlighter" aria-hidden="true"><code class="code"></code></pre>
    `;
  }

  firstUpdated() {
    const text = localStorage.getItem(this.id);
    if (text) {
      this.elemEditor_.value = text;
      this.updateHighlight_();
    }
    this.elemCode_.style.opacity = '1';
    this.elemHighlighter_.style.opacity = '1';
  }

  updated() {
    // TODO: Why is this necessary?
    this.value = this.elemEditor_.value;
    log.log(`"#${this.id}" code-editor updated`);
    this.updateHighlight_();
  }

  /** Handles 'click' of clear button; clears <code> element contents. */
  protected handlerClickClear_() {
    this.buttonRun_.classList.remove('actions--active');
    this.buttonRun_.classList.remove('actions--active');

    const event = new CustomEvent('code-clear', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    if (window.confirm('Are you sure you want to clear?')) {
      this.elemEditor_.value = '';
      this.elemCode_.innerHTML = '';
    }
  }

  /** Handles 'click' of run button and fires 'code-run' event. */
  protected handlerClickRun_() {
    this.buttonRun_.classList.add('actions--active');
    this.buttonRun_.classList.remove('actions--active');

    const event = new CustomEvent('code-run', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /** Handles 'click' of run button and fires 'code-run' event. */
  protected handlerClickStop_() {
    this.buttonRun_.classList.remove('actions--active');
    this.buttonRun_.classList.add('actions--active');

    const event = new CustomEvent('code-stop', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /** Handles 'input' event for textarea and stores contents in localstorage. */
  protected handlerInput_(event?: Event) {
    this.updateHighlight_();
    this.handlerScrollSync_(event);
    localStorage.setItem(this.id, this.elemEditor_.value);
    this.updated();
  }

  /** Scrolls <pre> element to scroll coords of event - sync with textarea. */
  protected handlerScrollSync_(event?: Event) {
    const target = event?.target as HTMLElement || this.elemEditor_;
    // Get and set x and y
    this.elemHighlighter_.scrollTop = target.scrollTop;
    this.elemHighlighter_.scrollLeft = target.scrollLeft;
  }

  /** Handles tab input to maintain correct indentation. */
  protected handlerTabKey_(event?: KeyboardEvent) {
    const code = this.elemEditor_.value;

    if(event?.key == 'Tab') {
      event?.preventDefault();

      let start = this.elemEditor_.selectionStart;
      let end = this.elemEditor_.selectionEnd;
      let textBeforeTab = code.slice(0, start);
      let textAfterTab = code.slice(end, this.elemEditor_.value.length);
      // where cursor moves after tab - moving forward by 1 char to after tab
      let cursorPos = start + 1;
       // add tab char
      this.elemEditor_.value = `${textBeforeTab}\t${textAfterTab}`;

      // move cursor
      start = cursorPos;
      end = cursorPos;

      this.updateHighlight_();
    }
  }

  /** Updates displayed text with syntax highlighted code. */
  protected updateHighlight_() {
    let text = this.elemEditor_.value;
    if (text[text.length-1] === '\n') text += ' ';

    this.elemCode_.innerHTML = Prism.highlight(text, Prism.languages[this.lang], this.lang);
  }
}
