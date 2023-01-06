/**
 * @fileoverview Controller for using p5.js and Tone.js as renderers.
 */

import p5 from 'p5';
import * as Tone from 'tone';

export class Engine {
  /** Render target for engine(s). */
  public canvas: HTMLElement = document.querySelector('#canvas')!;

  /** p5.js instance. */
  // @ts-ignore
  private p5_?: p5;

  constructor() {
    this.initListeners_();
  }

  /** Plays roll (i.e. code) through Tone.js instance. */
  public play(roll: any) {
    roll(Tone);
    // Tone.start();
  }

  /** Renders sketch (i.e. code) through p5.js instance. */
  public render(sketch: any) {
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
