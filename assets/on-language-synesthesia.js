/**
 * @fileoverview p5.js code to generate colors from hexadecimal language.
 */

// Test Data
data = {
  "root": {
    "example": "#f02#f0b#f0f#f04#f0c#f0b#f01#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f06#f0a#f11#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f07#f0c#f0f#f02#f0d#f00#f01#f03#f00#f08#f0e#f11#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f09#f0a#f0f#f02#f0d#f00#f01#f03#f00#f0a#f0e#f11#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f0b#f0c#f0f#f02#f0d#f00#f01#f03#f00#f0c#f0a#f11#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f0d#f0c#f0f#f02#f0d#f00#f01#f03#f00#f0e#f0a#f11#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f0f#f0c#f0f#f02#f0d#f00#f01#f03#f00#f10#f0a#f11#f03#f00#f05#f0e#f0f#f02#f0d#f00#f01#f03#f00#f11#f0c#f0f#f02#f0d#f00#f01#f03#f00#f12#f0a#f11#f03#f00#f05#f0e#f0f#f02"
  }
};

// Parse data.
const output = data.root.example.split(/#/gmi);

// p5.js code
const sketch = p => {
  const unit = 10;

  const hex3ToHex6 = (hex) => {
    return hex.split('').map((h) => {
      return h + h;
    }).join('');
  };

  const hexToColor = (p, hex) => {
    if (hex.length === 3) hex = hex3ToHex6(hex);

    const hex_ = hex.replace('#', '');
    const bigint = parseInt(hex_, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return p.color(r, g, b);
  };

  p.setup = () => {
    p.createCanvas(720, 480);
  };

  p.draw = () => {
    p.background(0);

    let x = unit;
    let y = unit;
    output.forEach((d) => {
      if (d) {
        const col = hexToColor(p, d);
        const bright = p.brightness(col);
        const w = (d.length * unit) * (bright / 255);

        if (x + (unit * 2) > p.width) {
          x = unit;
          y += (unit * 2);
        }

        p.fill(col);
        p.rect(x, y, w, unit);

        x += (w + unit);
      }
    });
  };
};

render(sketch);
