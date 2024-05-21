import { Container, Graphics, Text } from 'pixi.js';
import { gsap } from "gsap";

export class Player extends Container {
  constructor(position, x, y) {
    super();

    const playerPosition = new Text(position, { fontSize: 12, fill: 'white' });
    playerPosition.anchor.set(0.5);
    playerPosition.position.set(x, y);

    const playerCircle = new Graphics();
    playerCircle.beginFill(0x0000FF);
    playerCircle.drawCircle(0, 0, 15);
    playerCircle.endFill();
    playerCircle.position.set(x, y);

    this.addChild(playerCircle);
    this.addChild(playerPosition);
  };

  moveTo(x, y, duration) {
    gsap.to(this.children[0], {
      x: x, y: y, duration: duration
    });
    gsap.to(this.children[1], {
      x: x, y: y, duration: duration
    });
  }
};
