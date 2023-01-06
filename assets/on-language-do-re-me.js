/**
 * @fileoverview Tone.js code to generate melodies from 'do, re, me...' output.
 */

// Test data
data = {
  "root": {
    "example": "do re mi fa sol la ti do"
  }
};

// Parser
return data.root.example.split(', ');

// Tone.js code
const melody = output.result;
const notes = {
  'do': 'C4',
  're': 'D4',
  'mi': 'E4',
  'fa': 'F4',
  'sol': 'G4',
  'la': 'A5',
  'ti': 'B5',
  'do': 'C5',
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
