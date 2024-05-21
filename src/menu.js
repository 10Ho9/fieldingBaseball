import { Sprite, Container, Graphics, Text, utils } from 'pixi.js';

class TitleText extends Text {
  constructor(text, size, color, width, heigt) {
    super(text, { fontSize: size, fill: color });

    this.name = text;
    this.position.set(width, heigt);
  }
}

class Button extends Container {
  constructor(buttonText, x, y, width, height) {
    super();

    this.name = buttonText;
    this.observers = [];

    const buttonGraphics = new Graphics();
    buttonGraphics.beginFill(this.checked ? 0x00FFFF : 0xFFFFFF);
    buttonGraphics.lineStyle(2, 0x00000);
    buttonGraphics.drawRect(0, 0, width, height);
    buttonGraphics.endFill();

    const buttonTextObj = new Text(buttonText, { fontSize: 16, fill: 'black' });
    buttonTextObj.anchor.set(0.5);
    buttonTextObj.position.set(width / 2, height / 2);

    this.eventMode = 'static';
    this.buttonMode = true;
    this.addChild(buttonGraphics, buttonTextObj);
    this.position.set(x, y);
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(data) {
    this.observers.forEach(observer => observer.update(data));
  }

}

class CheckButton extends Button {
  constructor(buttonText, index, x, y, width, height) {
    super(buttonText, x, y, width, height);

    this.checked = false;
    this.index = index;

    this.on('pointerdown', () => {
      this.setChecked();
      this.notifyObservers({ index: this.index, checked: this.checked });
    });

  }

  setChecked() {
    this.checked = !this.checked;
    this.children[0].tint = (this.checked ? 0x00FFFF : 0xFFFFFF);
  }
}

class UniqueButtons {
  constructor({ names, x, y, width, height }) {

    this.buttons = [];
    this.checked = [];

    names.forEach((name, index) => {
      let adjustedY = y;
      if (index >= 3 && index <= 5) {
        adjustedY += 30;
      } else if (index >= 6 && index <= 8) {
        adjustedY += 60;
      }
      let adjustedX = x + (index % 3) * 150;

      const button = new CheckButton(name, index, adjustedX, adjustedY, width, height);
      button.addObserver(this);
      this.buttons.push(button);
      this.checked.push(button.checked);
    });
  }

  update({ index, checked }) {
    if (checked) {
      for (let i = 0; i < this.checked.length; i++) {
        if (this.checked[i]) {
          this.buttons[i].setChecked();
          this.checked[i] = false;
        }
      }
    }
    this.checked[index] = checked;
  }
}

class PopUp extends Container {
  constructor(view) {
    super();

    this.visible = true;
    this.hitResultSubButtons = [];
    this.emitter = new utils.EventEmitter();

    const popupBackground = new Graphics();

    const popupWidth = 500;
    const popupHeight = 350;
    const centerX = ((view.width - popupWidth) / 2);
    const centerY = (view.height - popupHeight) / 2;

    popupBackground.beginFill(0xFFFFFF);
    popupBackground.drawRect(centerX, centerY, popupWidth, popupHeight);
    popupBackground.endFill();

    const situationText = new TitleText('Situation', 16, 'black', centerX + 10, centerY + 10);
    const runnerText = new TitleText('Runner', 14, 'black', centerX + 10, centerY + 40);
    const runnerButtons = ['First', 'Second', 'Third'].map((name, index) => {
      return new CheckButton(name, index, centerX + 20 + index * 150, centerY + 10 + 60, 150, 20);
    });
    const hitText = new TitleText('Hit', 14, 'black', centerX + 10, centerY + 100);
    const hitResultButtons = new UniqueButtons({
      names: ['Ground Ball', 'Fly Ball', 'Hit'],
      x: centerX + 20,
      y: centerY + 130,
      width: 150,
      height: 20
    });

    const ballText = new TitleText('Ball', 14, 'black', centerX + 10, centerY + 160);
    const groundBallSubButtons = new UniqueButtons({
      names: ['P', 'C', '1B', '2B', '3B', 'SS'],
      x: centerX + 20,
      y: centerY + 190,
      width: 150,
      height: 20
    });

    const flyBallSubButton = new UniqueButtons({
      names: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'],
      x: centerX + 20,
      y: centerY + 190,
      width: 150,
      height: 20
    });

    const hitSubButton = new UniqueButtons({
      names: ['Single', 'Double', 'Triple'],
      x: centerX + 20,
      y: centerY + 150,
      width: 150,
      height: 20
    });
    const hitSubText = new TitleText('Ball', 14, 'black', centerX + 10, centerY + 190);
    const hitSubBallButton = new UniqueButtons({
      names: ['LF', 'CF', 'RF'],
      x: centerX + 20,
      y: centerY + 210,
      width: 150,
      height: 20
    });
    hitResultButtons.buttons.forEach(button => {
      button.addObserver({
        update: (data) => {
          this.showSubButtons(data.index);
        }
      });
    });
    this.hitResultSubButtons = [
      [ballText, groundBallSubButtons],
      [ballText, flyBallSubButton],
      [hitSubButton, hitSubText, hitSubBallButton]];

    const playButton = new Button('Play', centerX + 170, centerY + 300, 150, 20);
    playButton.on('pointerdown', () => {
      this.showSelectdButtons();
    });

    this.addChild(popupBackground, situationText, runnerText, ...runnerButtons,
      hitText, ...hitResultButtons.buttons, playButton);

    this.eventMode = 'static';
    this.on('pointerdown', (event) => {
      event.stopPropagation();
    });


  }
  showSubButtons(index) {
    this.hitResultSubButtons.forEach(elements => {
      elements.forEach(element => {
        if (element instanceof TitleText) {
          this.removeChild(element);
        } else {
          this.removeChild(...element.buttons);
        }
      });
    });

    const subButtons = this.hitResultSubButtons[index];
    subButtons.forEach(element => {
      if (element instanceof TitleText) {
        this.addChild(element);
      } else {
        this.addChild(...element.buttons);
      }
    });
  }

  showSelectdButtons() {
    const result = {
      Runner: [],
      Hit: [],
      Ball: []
    };
    let key;
    this.children.forEach(child => {
      if (child instanceof TitleText) key = child.name;
      if (child instanceof CheckButton && child.checked) result[key].push(child.name);
    });
    if (result.Hit.length === 0 || result.Ball.length === 0) alert('Hit und Ball fehlt');
    else {
      this.visible = false;
      this.emit('play', result);
    }
  }
}

class Hamburger extends Container {
  constructor(popUpContainer) {
    super();
    this.popUpContainer = popUpContainer;
    const sprite = Sprite.from('/vite.svg');
    this.addChild(sprite);

    this.position.set(10, 10);
    this.eventMode = 'dynamic';

    this.on('pointerover', () => {
      sprite.tint = 0xDDDDDD;
    });

    this.on('pointerout', () => {
      sprite.tint = 0xFFFFFF;
    });

    this.on('pointertap', () => {
      this.popUpContainer.visible = !this.popUpContainer.visible;
    });

  }
}
export class Menu extends Container {
  constructor(view) {
    super();

    this.popupContainer = new PopUp(view);
    this.hamburgerContainer = new Hamburger(this.popupContainer);
    this.addChild(this.popupContainer, this.hamburgerContainer);

  }
}

