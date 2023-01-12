/**
 * @fileoverview WebMidi.js code to generate beats from "poems".
 */

// Test data
data = {
  "root": {
    "example": "boom boom gat  \n    hiss chick boom  \n    gat chick"
  }
};

// Parse data.
const beat = data.root.example
  // .join(' ')
  // .replace(/[!\'s\.]/gi, '')
  .replace('  \n    ', ' ')
  .split(' ');

// WebMidi.js code.
const seq = (w, _in, out) => {
  const channels = {
    'boom': 1,   // bass
    'gat': 2,    // snare
    'hiss': 3,   // hi-hat (open)
    'chick': 4,  // rimshot / hi-hat (closed)
  };

  const interval = 200;
  const device = out[0]; // whatever the first Midi device is.

  let index = 0;
  setInterval(() => {
    const b = beat[index % beat.length];
    // all else just play a random channel
    if (channel == undefined) channel = Math.floor(Math.random() * 4);

    try {
      device.channels[channel].playNote('C4', {
        duration: interval / 2,
      });
    } catch (err) {}

    index++;
  }, interval);
};

midi(seq);
