/**
 * @fileoverview WebMidi.js code to generate beats from "poems".
 */

// Test data
data = {
  "root": {
    "example": "boom, boom, gat, hiss, chick, boom, gat, chick"
  }
};

// Parse data.
const beat = data.root.example.split(', ');

// WebMidi.js code.
// https://en.wikipedia.org/wiki/Solf%C3%A8ge
const channels = {
  'boom': 1,   // bass
  'gat': 2,    // snare
  'hiss': 3,   // hi-hat (open)
  'chick': 4,  // rimshot / hi-hat (closed)
};

const seq = (_in, out) => {
  const interval = 750;
  const device = out[0]; // whatever the first Midi device is.

  let index = 0;
  window.setInterval(() => {
    const channel = channels[beat[index % beat.length]];

    device.channels[channel].playNote('C4', {
      time: WebMidi.time + interval,
    });
  }, interval);
};

midi(seq);
