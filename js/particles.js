const PARTICLES_PER_SECOND = 80;
const PARTICLE_SPAWN_RATE = 1000 / PARTICLES_PER_SECOND;
const PARTICLE_GRAVITY = 0.00015;
const PARTICLE_CLASS = "particle";

let spawnTimer = 0;
let prevParticleTime = 0;

/**
 * Creates a falling particle effect on the specified element
 * @param {HTMLElement} element The element to create particles on
 * @returns the id of the animation frame requested for the effect
 */
function createParticles(element) {
  return requestAnimationFrame((time) => updateParticles(time, element));
}

/**
 * Creates and updates the particles for a falling effect
 * @param {Number} time the time in milliseconds of the animation frame
 * @param {HTMLElement} element the element with the particle effect
 */
function updateParticles(time, element) {
  const deltaTime = time - prevParticleTime;

  prevParticleTime = time;
  spawnTimer += deltaTime;

  if (element.mouseOver && spawnTimer >= PARTICLE_SPAWN_RATE) {
    spawnTimer %= PARTICLE_SPAWN_RATE;

    const particle = createParticle(element);

    particle.x = element.particleSpawnX;
    particle.y = element.particleSpawnY;
  }

  for (const particle of element.getElementsByClassName(PARTICLE_CLASS)) {
    particlePhysics(element, particle, deltaTime);
  }

  if (
    element.mouseOver ||
    element.getElementsByClassName(PARTICLE_CLASS).length
  ) {
    element.animationFrame = createParticles(element);
  }
}

/**
 * Creates a particle with default values and appends it to the element
 * @param {HTMLElement} element the element to create the particle on
 * @returns the created particle element
 */
function createParticle(element) {
  const particle = document.createElement("div");

  particle.classList.add(PARTICLE_CLASS);

  particle.velX = rand(-0.01, 0.01);
  particle.velY = 0.01;

  element.appendChild(particle);

  return particle;
}

/**
 * Updates the particle's position and velocity and removes it if necessary
 * @param {HTMLElement} element the element containing the particle
 * @param {HTMLElement} particle the particle to update
 * @param {Number} deltaTime the time since the last update
 */
function particlePhysics(element, particle, deltaTime) {
  particle.velY -= PARTICLE_GRAVITY * deltaTime;
  particle.x += particle.velX * deltaTime;
  particle.y -= particle.velY * deltaTime;

  particle.style.top = `${particle.y}px`;
  particle.style.left = `${particle.x}px`;

  if (particle.y > element.offsetHeight) {
    particle.remove();
  }
}

/**
 * Creates event listeners on all objects with the provided
 * class name to create a falling particle effect
 * @param {String} className the classname to add the event listeners to
 */
function createParticleEventListeners(className) {
  for (const element of document.getElementsByClassName(className)) {
    element.onmouseover = (event) => {
      element.mouseOver = true;

      cancelAnimationFrame(element.animationFrame);

      const cursorPos = getCursorPositionRelativeToElement(event);

      element.particleSpawnX = cursorPos.x;
      element.particleSpawnY = cursorPos.y;
      element.animationFrame = createParticles(element);
    };

    element.onmousemove = (event) => {
      const cursorPos = getCursorPositionRelativeToElement(event);

      element.particleSpawnX = cursorPos.x;
      element.particleSpawnY = cursorPos.y;
    };

    element.onmouseout = (event) => {
      element.mouseOver = false;

      cancelAnimationFrame(element.animationFrame);

      element.animationFrame = createParticles(element);
    };
  }
}
