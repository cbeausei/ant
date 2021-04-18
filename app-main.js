import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';

class AppMain extends LitElement {
  static get properties() {
    return {
      state: {type: Object},
    }
  }

  constructor() {
    super();
    this.baseStyle = html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 10px;
        width:100%;
      }
      button:hover {
        cursor: pointer;
      }
      canvas {
        flex: 1;
      }
    </style>
    `
    this.started = false;
    this.canvas = null;
    this.height = 100;
    this.width = 100;
    this.cw = 500;
    this.ch = 500;
    this.exitLoop = false;
    this.rateMs = 4;
    this.state = null;
  }

  render() {
    return html`
      ${this.baseStyle}
      <h1>Ant game</h1>
      <p>
        <span>height</span>
        <input id="height" value=${this.height}></input>
      </p>
      <p>
        <span>width</span>
        <input id="width" value=${this.width}></input>
      </p>
      <p>
        <span>rate (ms)</span>
        <input id="rate" value=${this.rateMs}></input>
      </p>
      <p>
        <button @click="${this.start}">Start</button>
      </p>
      <canvas id="canvas"></canvas>
    `
  }

  start() {
    console.log('Start.');
    if (!this.started) {
      this.canvas = this.shadowRoot.getElementById('canvas');
      this.canvas.height = this.cw;
      this.canvas.width = this.ch;
      this.ctx = this.canvas.getContext('2d');
      this.started = true;
    } else {
      this.exitLoop = true;
    }
    this.height = this.shadowRoot.getElementById('height').value;
    this.width = this.shadowRoot.getElementById('width').value;
    this.rateMs = this.shadowRoot.getElementById('rate').value;
    this.sh = this.ch / this.height,
    this.sw = this.cw / this.width,
    this.ctx.clearRect(0, 0, this.cw, this.ch);
    const field = new Array();
    for (let i = 0; i < this.width; ++i) {
      const line = new Array();
      for (let j = 0; j < this.height; ++j) {
        line.push(0);
      }
      field.push(line);
    }
    this.state = {
      x: Math.round(this.width / 2),
      y: Math.round(this.height / 2),
      dir: 'up',
      field,
    }
    setTimeout(() => this.loop(), this.rateMs * 2);
  }

  loop() {
    if (this.exitLoop) {
      this.exitLoop = false;
      return;
    }

    this.state.field[this.state.x][this.state.y] = 1 - this.state.field[this.state.x][this.state.y];
    switch (this.state.field[this.state.x][this.state.y]) {
      case 0:
        switch (this.state.dir) {
          case 'up':
            this.state.dir = 'left';
            break;
          case 'left':
            this.state.dir = 'down';
            break;
          case 'down':
            this.state.dir = 'right';
            break;
          case 'right':
            this.state.dir = 'up';
            break;
        }
        this.ctx.fillStyle = '#ffffff';
        break;
      case 1:
        switch (this.state.dir) {
          case 'up':
            this.state.dir = 'right';
            break;
          case 'left':
            this.state.dir = 'up';
            break;
          case 'down':
            this.state.dir = 'left';
            break;
          case 'right':
            this.state.dir = 'down';
            break;
        }
        this.ctx.fillStyle = '#000000';
        break;
    }
    this.ctx.fillRect(this.state.x * this.sw,
        this.state.y * this.sh,
        this.sw, this.sh);

    switch (this.state.dir) {
      case 'up':
        this.state.y -= 1;
        break;
      case 'left':
        this.state.x -= 1;
        break;
      case 'down':
        this.state.y += 1;
        break;
      case 'right':
        this.state.x += 1;
        break;
    }

    if (this.state.x < 0 ||
        this.state.x >= this.width ||
        this.state.y < 0 ||
        this.state.y >= this.height) {
      this.exitLoop = true;
    }

    setTimeout(() => this.loop(), this.rateMs);
  }
}


customElements.define('app-main', AppMain);
