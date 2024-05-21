import { Application, Assets, Sprite, Graphics, Rectangle } from 'pixi.js';
import { Player } from './src/player.js';
import { Menu } from './src/menu.js';
import { Ball } from './src/ball.js'

const startPosition = [
  { position: 'P', x: 513, y: 630 },
  { position: 'C', x: 513, y: 745 },
  { position: '1B', x: 611, y: 600 },
  { position: '2B', x: 575, y: 537 },
  { position: '3B', x: 418, y: 600 },
  { position: 'SS', x: 458, y: 537 },
  { position: 'LF', x: 336, y: 434 },
  { position: 'CF', x: 513, y: 387 },
  { position: 'RF', x: 728, y: 449 },
];

const ballPosition = {
  home: [513, 725],
  firstB: [614, 629],
  secondB: [513, 536],
  thridB: [415, 631],
  left: [374, 487],
  center: [516, 450],
  right: [683, 486],
  firstSecond: [458, 533],
  seconThird: [570, 533],
  firstFirst: [595, 590],
  thirdThird: [425, 595],
  leftb: [300, 380],
  centerb: [510, 330],
  rightb: [750, 410],
  leftb: [513, 728],
  leftb: [513, 728],
  centerb: [513, 728]
};

const app = new Application({ resizeTo: window, });

document.body.appendChild(app.view);

const backgroundTexture = await Assets.load('/field.png');
const background = new Sprite(backgroundTexture);
const scaleX = app.renderer.width / background.width;
const scaleY = app.renderer.height / background.height;

background.width = app.renderer.width;
background.height = app.renderer.height;

const baseballTexture = await Assets.load('/Baseball.svg');
const baseball = new Ball(baseballTexture, ballPosition.home[0] * scaleX, ballPosition.home[1] * scaleY);
app.stage.addChild(background, baseball);

const pg = {
  name: "Pitcher Ground Ball",
  moveTo: [
    [513, 664, 2], [513, 688, 2], [613, 630, 2],
    [657, 612, 3], [418, 600, 2], [513, 534, 2],
    [416, 473, 3], [447, 430, 3], [701, 569, 3]
  ]
}

const cg = {
  name: "Catcher Ground Ball",
  moveTo: [
    [485, 660, 2], [513, 707, 2], [613, 630, 2],
    [645, 590, 3], [418, 600, 2], [513, 534, 2],
    [416, 473, 3], [447, 430, 3], [689, 548, 3]
  ]
}

const fg = {
  name: "1B Ground Ball",
  moveTo: [
    [613, 630, 2], [627, 671, 2], [587, 588, 2],
    [591, 550, 3], [418, 600, 2], [513, 534, 2],
    [416, 473, 3], [447, 430, 3], [689, 548, 3]
  ]
}

const sg = {
  name: "2B Ground Ball",
  moveTo: [
    [568, 633, 2], [645, 676, 2], [613, 630, 2],
    [565, 547, 2], [418, 600, 2], [513, 534, 2],
    [416, 473, 3], [447, 430, 3], [689, 548, 3]
  ]
}
const tg = {
  name: "3B Ground Ball",
  moveTo: [
    [495, 626, 2], [613, 680, 3], [613, 630, 2],
    [637, 584, 3], [440, 572, 2], [513, 534, 2],
    [416, 473, 3], [447, 430, 3], [699, 505, 3]
  ]
}
const ssg = {
  name: "SS Ground Ball",
  moveTo: [
    [504, 630, 2], [613, 680, 3], [613, 630, 2],
    [637, 584, 3], [436, 550, 2], [468, 547, 2],
    [416, 473, 3], [447, 430, 3], [699, 505, 3]
  ]
}
const players = startPosition.map(pos => new Player(pos.position, pos.x * scaleX, pos.y * scaleY));

players.forEach(player => {
  app.stage.addChild(player);
});

const menu = new Menu(app.view);
app.stage.addChild(menu);

background.eventMode = 'static';
background.on('pointerdown', () => {
  if (menu.popupContainer.visible) {
    menu.popupContainer.visible = false;
  }
});


const graphics = new Graphics();

graphics.beginFill(0xDE3249, 0);
graphics.drawRect(50, 50, window.innerWidth, window.innerHeight);
graphics.endFill();
graphics.hitArea = new Rectangle(50, 50, window.innerWidth, window.innerHeight);
graphics.eventMode = 'dynamic';
graphics.on('pointertap', (event) => {
  const position = event.data.global;
  console.log(`X: ${position.x}, Y: ${position.y}`);
});

//app.stage.addChild(graphics);
menu.popupContainer.on('play', () => {
  baseball.moveTo(ballPosition.right[0] * scaleX, ballPosition.right[1] * scaleY, 4)

  players.forEach((player, index) => {
    let [x, y, d] = ssg.moveTo[index];
    player.moveTo(x * scaleX, y * scaleY, d)
  });
})
