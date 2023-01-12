/**
 * @fileoverview Instantiates an On Language instance.
 */

import {XML_SCHEMA} from '../../globals';
import * as log from '../../globals/log';
import * as utils from '../../globals/utils';
import {chatAPIResponseHandler} from './api-handlers';
import {Engine} from './engine';
import marked from './marked';

/** Delay time between triggering persona responses. */
const DELAY_MS = 1 * 500;

export class OnLanguage {
  /** Buttons to trigger prompts. */
  private elemsButton_: { [key: string]: HTMLButtonElement; };

  /** Input elements of prompts. */
  private elemsInput_: { [key: string]: HTMLInputElement; };

  /** Elements containing <code-input>. */
  private elemsCode_: { [key: string]: HTMLTextAreaElement; };

  /** Engine */
  private engine_: Engine = new Engine();

  constructor() {
    this.elemsButton_ = {
      user: document.querySelector('#ask')!,
    };
    this.elemsInput_ = {
      response: document.querySelector('#response')!,
      user: document.querySelector('#prompt')!,
    };
    this.elemsCode_ = {
      data: document.querySelector('#data')!,
      engine: document.querySelector('#engine')!,
      schema: document.querySelector('#schema')!,
    };

    this.initListeners_();
    this.init_();
  }

  /** Retrieves all <detail> elements in DOM. */
  private getDetailElems_(callback: any) {
    Array.from(document.querySelectorAll('details'))
      .forEach((elem: HTMLDetailsElement) => {
        callback(elem);
      });
  }

  /** Initializes On Language. */
  private async init_() {
    utils.xml.formatXML(XML_SCHEMA,
      <HTMLTextAreaElement>this.elemsCode_.schema);
  }

  /** Adds event listeners to elements. */
  private initListeners_() {
    const ids = ['data'];

    this.getDetailElems_((elem: HTMLDetailsElement) => {
      elem.addEventListener('click', (event: Event) => {
        const target = event.target;
        if (target === elem) {
          elem.toggleAttribute('open');
        }
      }, false);
    });

    this.elemsInput_.user
      ?.addEventListener('enter', () => {});

    this.elemsButton_.user
      ?.addEventListener('click', this.handlerSubmit.bind(this));

    this.elemsInput_.user
      ?.addEventListener('submit', this.handlerSubmit.bind(this));

    this.elemsInput_.user
      ?.addEventListener('empty', () => {});

    this.elemsCode_.engine
      .addEventListener('code-run', this.handlerEngineRun_.bind(this));

    this.elemsCode_.engine
      .addEventListener('code-stop', this.handlerEngineStop_.bind(this));

    ids.forEach((id: string) => {
      const elem = this.elemsCode_[id];
      elem?.addEventListener('input', () => {
        const text = (elem.innerHTML || '')
        localStorage.setItem(id, text);
      });
    });

    window.addEventListener('DOMContentLoaded', () => {
      ids.forEach((id: string) => {
        const text = localStorage.getItem(id);
        const elem = this.elemsCode_[id];
        if (text && elem) elem.value = text;
      });
    });
  }

  /** Adds error state to element for 1 second. */
  private addError_(elem: HTMLElement | HTMLButtonElement | HTMLInputElement): Promise<void> {
    return new Promise((resolve, _reject) => {
      elem.toggleAttribute('error', true);
      window.setTimeout(() => {
        elem.removeAttribute('error');
        resolve();
      }, DELAY_MS);
    });
  }

  /** Fetches response from ChatGPT. */
  private async fetchMessage_(text: string):
      Promise<string | null | undefined> {
    try {
      const msg = await chatAPIResponseHandler('ask/', text);
      // Remove disabled states from user input.
      // TODO: removing attribute isn't working.
      // this.elemsInput_.user.toggleAttribute('disabled', true);
      // this.elemsButton_.user.toggleAttribute('disabled', true);

      return msg;
    } catch (err) {
      log.error(err);
      await this.addError_(this.elemsInput_.user);

      return;
    }
  }

  /** Handles execution engine code. */
  private async handlerEngineRun_() {
    const text = this.elemsCode_.data.value!;
    let data = {};
    try {
      data = JSON.parse(text || '');
    } catch (err) {}

    const engineJS = `(data, canvas, render, play, midi) => {
      ${this.elemsCode_.engine.value}
    }`;

    try {
      eval(engineJS)(
        data,
        this.engine_.canvas,
        this.engine_.render.bind(this.engine_),
        this.engine_.play.bind(this.engine_),
      );
    } catch (err) {
      log.error(err);
    }
  }

  /** Handles execution of pending eval? */
  private async handlerEngineStop_() {
    // Hack to "stop" eval.
    // TODO: Replace eval with WebWorker http://blog.namangoel.com/replacing-eval-with-a-web-worker
    location.reload();
  }

  /** Handles ChatGPT Response and posts it to response panel. */
  private async handlerResponse(res: any) {
    document.body.classList.remove('--pending');

    if (res) {
      // If/when res returned is XML within markdown code block.
      // this.elemsInput_.response.innerHTML = marked.parse(res);

      // await this.tokenizeMarkdown_(res)
      //   .then((code) => utils.replace(code.text, /```/gmi))
      //   .then((xml) => utils.xml.XMLtoJSON(xml))
      //   .then((data) => {
      //     this.elemsCode_.data.value = JSON.stringify(data, null, 2);
      //   })
      //   .catch((err) => log.warn(err));

      // If/when res returned is "pure" XML.
      this.elemsInput_.response.textContent = res;
      const json = utils.xml.XMLtoJSON(res);
      this.elemsCode_.data.value = JSON.stringify(json, null, 2);

      this.getDetailElems_((elem: HTMLDetailsElement) => {
        elem.toggleAttribute('open', true);
      });
    } else {
      log.warn('No response');
    }
  }

  /** Handles user input submissions. */
  private async handlerSubmit() {
    document.body.classList.add('--pending');

    // Prepend data structure instructions to prompt.
    const dataSchema = this.elemsCode_.schema.value;
    const text = `
      Use this XML data structure for your response: "${dataSchema}".
      ${this.elemsInput_.user.value}`;

    const res = await this.fetchMessage_(text);
    this.handlerResponse(res);
  }

  /** Parses string into a Tokenized object of Markdown elements. */
  private async tokenizeMarkdown_(mdStr: string, type = 'code') {
    const tokens = marked.lexer(mdStr);
    const out: any = tokens.filter((entry) => {
      return entry.type === type;
    })[0];

    return out;
  }
}
