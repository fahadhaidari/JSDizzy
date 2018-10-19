window.onload = function() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const quads = [];
  const size = 2;
  const speed = 2;
  const colors = ["orange", "#4466FF", "white",  "#FF4422"];
  let grid = [];
  let player = null;
  let Key = {
    _pressed: {},
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };

  document.addEventListener('keyup', function(event) {
    Key.onKeyup(event);
  }, false);
  document.addEventListener('keydown', function(event) {
    Key.onKeydown(event);
  }, false);

  const update = function() {
    { quads.length && animate() }

    if (Key.isDown(Key.RIGHT)) {
      player.velVec.x += speed;
    }
    if (Key.isDown(Key.LEFT)) {
      player.velVec.x -= speed;
    }
    if (Key.isDown(Key.UP)) {
      player.velVec.y -= speed;
    }
    if (Key.isDown(Key.DOWN)) {
      player.velVec.y += speed;
    }

    player.velVec.x *= 0.9;
    player.velVec.y *= 0.9;
    player.pos.x += player.velVec.x;
    player.pos.y += player.velVec.y;

    requestAnimationFrame(update);
  };

  const init = function() {
    canvas.width = 600;
    canvas.height = 600;
    
    for (var i = 0; i < 50; i++) {
      grid[i] = [];
      for (var j = 0; j < 50; j++) {
        var quad = new Quad(i * (size + 10), + j * (size + 10), size, size);
        grid[i][j] = quad;
        quads.push(quad);
      }
    }
  };

  const animate = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        const currentGrid = grid[i][j];
        player = grid[25][25];

        const dx = currentGrid.pos.x - player.pos.x;
        const dy = currentGrid.pos.y - player.pos.y;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (currentGrid != player) {
          const xVel = -Math.cos(angle) * (1 / distance) * 9000;
          const yVel = -Math.sin(angle) * (1 / distance) * 9000;
          currentGrid.pos.x += xVel;
          currentGrid.pos.y += yVel;
        }

        currentGrid.draw(distance);
      }
    }
  };

  function Quad(x, y, width, height) {
    this.pos = {
      x: x,
      y: y
    };
    this.factor = 0;
    this.velVec = {
      x: 0,
      y: 0
    };
    this.xVel = 0;
    this.yVel = 0;
    var colorIndex = undefined;

    (function() {
      colorIndex = Math.round(Math.random() * colors.length);
      context.fillStyle = colors[colorIndex];
      context.fillRect(x, y, width, height);
      context.stroke();
    })();

    this.draw = function(factor) {
      factor *= 0.007;
      const color =  colors[colorIndex];

      context.fillStyle = color;
      context.fillRect(this.pos.x, this.pos.y, width * factor, height * factor);
    };
  }

  init();
  update();
}
