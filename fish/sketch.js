let fishX, fishY, fishZ;
let targetX, targetY, targetZ;
let fishRotation = 0;
let easing = 0.02;
let hunger = 100; // Initial hunger value
let happiness = 100; // Initial happiness value
let foodX, foodY, isFoodPresent = false;
let giftX, giftY, isGiftPresent = false;
let isFeedButtonPressed = false;
let isGiftButtonPressed = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  fishX = 0;
  fishY = 0;
  fishZ = 0;
  targetX = 0;
  targetY = 0;
  targetZ = 0;
  noStroke();
}

function draw() {
  background(180, 2000, 220);

  // Update buttons and progress bars
  updateUI();

  // If no food or gift is present, the fish follows the mouse
  if (!isFoodPresent && !isGiftPresent) {
    targetX = mouseX - width / 2;
    targetY = mouseY - height / 2;
  }

  // Smoothly rotate towards the target
  let angle = atan2(targetY - fishY, targetX - fishX);
  fishRotation = lerp(fishRotation, angle, easing);

  // Move the fish
  fishX = lerp(fishX, targetX, easing);
  fishY = lerp(fishY, targetY, easing);

  // Draw the fish
  push();
  translate(fishX, fishY, fishZ);
  rotateY(fishRotation);
  drawFish3D();
  pop();

  // Display food or gift
  if (isFoodPresent) {
    fill(255, 204, 0);
    push();
    translate(foodX, foodY, 0);
    sphere(5);
    pop();

    // If the fish is close to the food
    if (dist(fishX, fishY, foodX, foodY) < 10) {
      isFoodPresent = false;
      hunger = min(hunger + 20, 100); // Increase hunger level
      showHearts();
    }
  }

  if (isGiftPresent) {
    fill(200, 0, 200);
    push();
    translate(giftX, giftY, 0);
    box(15);
    pop();

    // If the fish is close to the gift
    if (dist(fishX, fishY, giftX, giftY) < 10) {
      isGiftPresent = false;
      happiness = min(happiness + 20, 100); // Increase happiness level
      showHearts();
    }
  }

  // Gradually decrease hunger and happiness levels
  if (frameCount % 60 === 0) {
    hunger = max(hunger - 1, 0);
    happiness = max(happiness - 1, 0);
  }

  // Release button states
  isFeedButtonPressed = false;
  isGiftButtonPressed = false;
}

function drawFish3D() {
  fill(255, 150, 100);
  ellipsoid(40, 20, 20); // Fish body

  // Adjusted tail (larger)
  fill(255, 100, 80);
  push();
  translate(-35, 0, 0); // Move the tail slightly away from the body
  rotateY(PI / 4);
  scale(0.8, 1.2, 1); // Enlarge the tail proportionally
  cone(15, 60); // Increase base radius and height
  pop();

  // Top fin
  fill(255, 120, 120);
  push();
  translate(0, -15, 0);
  rotateX(PI / 4);
  scale(0.3, 1, 1);
  cylinder(3, 15);
  pop();

  // Bottom fin
  push();
  translate(0, 15, 0);
  rotateX(-PI / 4);
  scale(0.3, 1, 1);
  cylinder(3, 15);
  pop();

  // Fish eyes
  fill(255);
  push();
  translate(30, -5, 12);
  sphere(5);
  fill(0);
  translate(1, 0, 3);
  sphere(2);
  pop();

  push();
  translate(30, -5, -12);
  sphere(5);
  fill(0);
  translate(1, 0, -3);
  sphere(2);
  pop();

  // Fish mouth
  fill(0);
  push();
  translate(35, 0, 0);
  sphere(1.5);
  pop();
}

function mousePressed() {
  // Check if the mouse is clicking within the button area and no interaction is in progress
  if (!isFoodPresent && !isGiftPresent) {
    if (mouseX > width - 200 && mouseX < width - 120 && mouseY < 50) {
      // Feed button
      foodX = random(-width / 2, width / 2);
      foodY = -height / 2 + 20; // Food drops from the top of the screen
      targetX = foodX;
      targetY = foodY;
      isFoodPresent = true;
      isFeedButtonPressed = true; // Feed button pressed
    } else if (mouseX > width - 100 && mouseX < width - 20 && mouseY < 50) {
      // Gift button
      giftX = random(-width / 2, width / 2);
      giftY = height / 2 - 30; // Gift appears at the bottom of the screen
      targetX = giftX;
      targetY = giftY;
      isGiftPresent = true;
      isGiftButtonPressed = true; // Gift button pressed
    }
  }
}

function updateUI() {
  // Use 2D mode to draw the UI
  push();
  resetMatrix();
  translate(-width / 2, -height / 2);

  // Draw progress bars
  fill(255);
  textSize(16);
  text("Hunger", 20, 20);
  text("Happiness", 20, 60);

  fill(200, 90, 90);
  rect(100, 10, map(hunger, 0, 100, 0, 100), 10);

  fill(90, 200, 90);
  rect(100, 50, map(happiness, 0, 100, 0, 100), 10);

  // Draw buttons in the top right corner
  stroke(0); // Button border color
  strokeWeight(2);

  // Feed button (yellow)
  stroke(150, 130,20); // Yellow border for the "Feed" button
  strokeWeight(2);
  fill(isFeedButtonPressed ? color(255, 215, 0, 180) : color(255, 215, 70)); // If pressed, button darkens
  rect(width - 200, 10, 80, 30);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Food", width - 160, 55); // Add explanation text

  // Gift button (pink)
  stroke(255, 20, 20); // Pink border for the "Present" button
  strokeWeight(2);
  fill(isGiftButtonPressed ? color(255, 105, 180, 180) : color(255, 155, 180)); // If pressed, button darkens
  rect(width - 100, 10, 80, 30);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Gift", width - 60, 55); // Add explanation text

  noStroke(); // Disable stroke to avoid affecting other drawings
  pop();
}

function showHearts() {
  // Show heart effect above the fish's head
  push();
  translate(fishX, fishY - 30, fishZ);
  fill(255, 0, 0);
  sphere(3);
  pop();
}

