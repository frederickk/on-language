/**
 * @fileoverview Tone.js code to generate melodies from 'do, re, me...' output.
 */

// Test data
data = {
  "root": {
    "example": "do, di, re, ri, mi, fa, fi, sol, si, la, li, ti, do"
  }
};

// Parse data.
const melody = data.root.example.split(', ');

// Tone.js code.
// https://en.wikipedia.org/wiki/Solf%C3%A8ge
const notes = {
  'do': 'C4',
  'di': 'C#4',
  're': 'D4',
  'ri': 'D#4',
  'mi': 'E4',
  'fa': 'F4',
  'fi': 'F#4',
  'sol': 'G4',
  'si': 'G$4',
  'la': 'A5',
  'li': 'A#5',
  'ti': 'B5',
};

const roll = (t) => {
  const synth = new t.Synth().toDestination();

  let index = 0;
	t.Transport.scheduleRepeat((time) => {
    const note = notes[melody[index % melody.length]];
    synth.triggerAttackRelease(note, '8n', time + .1);
    index++;
  }, '8n');

  t.Transport.start();
};

play(roll);
