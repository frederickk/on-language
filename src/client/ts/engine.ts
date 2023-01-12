/**
 * @fileoverview Controller for using p5.js and Tone.js as renderers.
 */

import p5 from 'p5';
import {WebMidi} from 'webmidi';
import * as Tone from 'tone';
import * as log from '../../globals/log';

export class Engine {
  /** Render target for engine(s). */
  public canvas: HTMLElement = document.querySelector('#canvas')!;

  /** p5.js instance. */
  // @ts-ignore
  private p5_?: p5;

  constructor() {
    this.initListeners_();
  }

  /** Plays sketch (i.e. code) through Midi devices through WebMidi.js. */
  public midi(sketch: any) {
    log.log('▶️ WebMidi.js');
    const onEnabled = async () => {
      sketch(WebMidi, WebMidi.inputs, WebMidi.outputs);
    };

    WebMidi
      .enable({
        sysex: true,
      })
      .then(onEnabled)
      .catch(err => log.warn(err));
  }

  /** Plays sketch (i.e. code) through Tone.js instance. */
  public play(sketch: any) {
    log.log('▶️ Tone.js');
    sketch(Tone);
    // Tone.start();
  }

  /** Renders sketch (i.e. code) through p5.js instance. */
  public render(sketch: any) {
    log.log('🎨 p5.js');
    this.clearCanvas();
    this.p5_ = new p5(sketch, this.canvas);
  }

  /** Clears canvas content. */
  public clearCanvas() {
    if (window.confirm('Are you sure you want to clear canvas?')) {
      this.canvas.innerHTML = '';
    }
  }

  /** Scrolls to HTML canvas element if innerHTML is not empty. */
  private handlerCanvasContent_() {
    if (this.canvas.innerHTML.trim() !== '' ||
        this.canvas.textContent?.trim() !== '') {
      this.canvas.scrollIntoView({
        behavior: 'smooth',
        block: 'start', //'center',
        inline: 'center',
      });
    }
  }

  /** Adds event listeners. */
  private initListeners_() {
    this.observeCanvas_();

    this.canvas
      .addEventListener('input', this.handlerCanvasContent_.bind(this));
  }

  /** Observes changes to HTML canvas element. */
  private observeCanvas_() {
    const MutationObserver = window.MutationObserver;
    const observer = new MutationObserver(
      this.handlerCanvasContent_.bind(this));
    observer.observe(this.canvas, {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

}
