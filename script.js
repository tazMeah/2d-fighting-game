let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => (this.isAttacking = false), 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  color: "blue",
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "red",
});

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update("blue");
  enemy.update("red");

  // detect collisions
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("attacked enemy.");
  }
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("attacked player.");
  }
}

animate();

window.addEventListener("keydown", function (event) {
  console.log(event.key);
  // player movement
  if (event.key == "d") {
    player.velocity.x = 5;
  }
  if (event.key == "a") {
    player.velocity.x = -5;
  }
  if (event.key == "w") {
    player.velocity.y = -20;
  }

  // enemy movement
  if (event.key == "ArrowRight") {
    enemy.velocity.x = 5;
  }
  if (event.key == "ArrowLeft") {
    enemy.velocity.x = -5;
  }
  if (event.key == "ArrowUp") {
    enemy.velocity.y = -20;
  }

  // attacking
  if (event.key == " ") {
    player.attack();
  }
  if (event.key == "ArrowDown") {
    enemy.attack();
  }
});

window.addEventListener("keyup", function (event) {
  console.log(event.key);
  if (event.key == "d") {
    player.velocity.x = 0;
  }
  if (event.key == "a") {
    player.velocity.x = 0;
  }
  if (event.key == "ArrowRight") {
    enemy.velocity.x = 0;
  }
  if (event.key == "ArrowLeft") {
    enemy.velocity.x = 0;
  }
});
