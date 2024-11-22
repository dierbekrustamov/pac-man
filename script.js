const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const pacman = {
  x: 50,
  y: 50,
  size: 20,
  dx: 2,
  dy: 0,
  angle: 0, // New property to track direction
};
const pellets = [];
for (let i = 0; i < 10; i++) {
  pellets.push({
    x: Math.random() * (canvas.width - 10),
    y: Math.random() * (canvas.height - 10),
    size: 10,
    collected: false,
  });
}
// Walls
const walls = [
  { x: 0, y: 0, width: 400, height: 10 }, // Top wall
  { x: 0, y: 0, width: 10, height: 400 }, // Left wall
  { x: 390, y: 0, width: 10, height: 400 }, // Right wall
  { x: 0, y: 390, width: 400, height: 10 }, // Bottom wall
  { x: 100, y: 100, width: 10, height: 200 }, // Vertical wall
  { x: 250, y: 100, width: 10, height: 200 }, // Another vertical wall
];
// Ghosts
const ghosts = [
  { x: 200, y: 200, size: 20, dx: 0, dy: 0, color: "red" },
  { x: 300, y: 300, size: 20, dx: 0, dy: 0, color: "pink" },
  { x: 350, y: 350, size: 20, dx: 0, dy: 0, color: "green" },
];
let score = 0;
let isGameOver = false;
function drawPacman() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(pacman.x, pacman.y);
  // Agar Pac-Man chapga qarayotgan bo'lsa, burchaklarni teskari qilamiz
  let startAngle = pacman.angle - 2.6;
  let endAngle = pacman.angle + 2.6;
  // Agar Pac-Man o'ngga qarayotgan bo'lsa (default)
  if (pacman.dx > 0) {
    startAngle = pacman.angle + Math.PI - 2.6;
    endAngle = pacman.angle + Math.PI + 2.6;
  }
  // Agar Pac-Man chapga qarayotgan bo'lsa
  else if (pacman.dx < 0) {
    startAngle = pacman.angle + Math.PI - 2.6; // Teskari burchaklar
    endAngle = pacman.angle + Math.PI + 2.6;
  }
  ctx.arc(pacman.x, pacman.y, pacman.size / 2, startAngle, endAngle);
  ctx.lineTo(pacman.x, pacman.y);
  ctx.fill();
}
function drawPellets() {
  ctx.fillStyle = "white";
  pellets.forEach((pellet) => {
    if (!pellet.collected) {
      ctx.beginPath();
      ctx.arc(pellet.x, pellet.y, pellet.size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}
function drawWalls() {
  ctx.fillStyle = "blue";
  walls.forEach((wall) => {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });
}

function drawGhosts() {
  ghosts.forEach((ghost) => {
    ctx.fillStyle = ghost.color;

    // Draw body
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.size / 2, Math.PI, 2 * Math.PI);
    ctx.lineTo(ghost.x + ghost.size / 2, ghost.y + ghost.size / 2);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(
        ghost.x + ghost.size / 2 - (i + 1) * (ghost.size / 4),
        ghost.y + ghost.size / 2 + (i % 2 === 0 ? -5 : 5)
      );
    }
    ctx.lineTo(ghost.x - ghost.size / 2, ghost.y + ghost.size / 2);
    ctx.closePath();
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ghost.x - 5, ghost.y - 5, 3, 0, 2 * Math.PI);
    ctx.arc(ghost.x + 5, ghost.y - 5, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      ghost.x - 5 + ghost.dx,
      ghost.y - 5 + ghost.dy,
      1.5,
      0,
      2 * Math.PI
    );
    ctx.arc(
      ghost.x + 5 + ghost.dx,
      ghost.y - 5 + ghost.dy,
      1.5,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
}

function updateGhosts() {
  ghosts.forEach((ghost) => {
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 50) {
      ghost.dx = (dx / distance) * 1.5;
      ghost.dy = (dy / distance) * 1.5;
    }
    ghost.x += ghost.dx;
    ghost.y += ghost.dy;
    walls.forEach((wall) => {
      if (
        ghost.x + ghost.size / 2 > wall.x &&
        ghost.x - ghost.size / 2 < wall.x + wall.width &&
        ghost.y + ghost.size / 2 > wall.y &&
        ghost.y - ghost.size / 2 < wall.y + wall.height
      ) {
        ghost.x -= ghost.dx;
        ghost.y -= ghost.dy;
      }
    });
    // Pac-Man collision
    if (
      Math.sqrt(
        Math.pow(pacman.x - ghost.x, 2) + Math.pow(pacman.y - ghost.y, 2)
      ) <
      pacman.size / 2 + ghost.size / 2
    ) {
      alert("Game Over! You were caught by a ghost!");
      isGameOver = true;
    }
  });
}
function update() {
  if (isGameOver) return;
  pacman.x += pacman.dx;
  pacman.y += pacman.dy;
  // Update Pac-Man's angle based on direction
  if (pacman.dx > 0) pacman.angle = 0; // Right
  else if (pacman.dx < 0) pacman.angle = Math.PI; // Left
  else if (pacman.dy > 0) pacman.angle = 1.5 * Math.PI; // Down
  else if (pacman.dy < 0) pacman.angle = 0.5 * Math.PI; // Up
  // Wall collision for Pac-Man
  walls.forEach((wall) => {
    if (
      pacman.x + pacman.size / 2 > wall.x &&
      pacman.x - pacman.size / 2 < wall.x + wall.width &&
      pacman.y + pacman.size / 2 > wall.y &&
      pacman.y - pacman.size / 2 < wall.y + wall.height
    ) {
      pacman.x -= pacman.dx;
      pacman.y -= pacman.dy;
    }
  });
  // Update ghost positions
  updateGhosts();
  // Pellet collision
  pellets.forEach((pellet) => {
    const dx = pacman.x - pellet.x;
    const dy = pacman.y - pellet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pacman.size / 2 + pellet.size / 2 && !pellet.collected) {
      pellet.collected = true;
      score += 10; // Increase score by 10 for each pellet collected
    }
  });
  // Check for win condition
  if (pellets.every((pellet) => pellet.collected)) {
    alert("Congratulations! You've collected all the pellets!");
    isGameOver = true;
  }
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWalls();
  drawPellets();
  drawPacman();
  drawGhosts();
  update();
  requestAnimationFrame(gameLoop);
}
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      pacman.dy = -2;
      pacman.dx = 0;
      break;
    case "ArrowDown":
      pacman.dy = 2;
      pacman.dx = 0;
      break;
    case "ArrowLeft":
      pacman.dx = -2;
      pacman.dy = 0;
      break;
    case "ArrowRight":
      pacman.dx = 2;
      pacman.dy = 0;
      break;
  }
});
gameLoop();
