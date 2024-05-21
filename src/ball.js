import { Sprite } from 'pixi.js'
import { gsap } from 'gsap';

export class Ball extends Sprite {
  constructor(baseballTexture, x, y) {
    super(baseballTexture);
    this.x = x;
    this.y = y;
    this.anchor.set(0.5);
    this.scale.set(0.05);

  }
  moveTo(x, y, duration) {
    gsap.to(this, {
      x: x, y: y, duration: duration
    });
  }
}
