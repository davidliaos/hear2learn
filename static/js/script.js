document.addEventListener("DOMContentLoaded", function () {
  let isPlaying = false;
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const btn = document.getElementById("playPauseBtn");
  btn.addEventListener("click", togglePlayPause);

  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 30 + 5; // Reduced size range to 5-35
      this.speedX = (Math.random() * 7 - 3.5) * 0.7; // Slower speed
      this.speedY = (Math.random() * 7 - 3.5) * 0.7;
      this.color = `rgba(255, 0, 0, ${Math.random().toFixed(2)})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.5) this.size -= 0.3;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handleParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].size <= 0.5) {
        particles.splice(i, 1);
      }
    }
  }

  function emitParticles() {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.top + rect.height / 2 + window.scrollY;
    for (let i = 0; i < 25; i++) {
      particles.push(new Particle(x, y));
    }
  }

  async function togglePlayPause() {
    const icon = btn.querySelector("i");
    if (isPlaying) {
      await stopRecording();
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
      console.log("Paused");
      clearInterval(particleInterval);
    } else {
      try {
        await startRecording();
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
        console.log("Playing");
        particleInterval = setInterval(emitParticles, 100);
      } catch (e) {
        alert("Microphone access is required");
      }
    }
    isPlaying = !isPlaying;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
  }

  animate();
  let particleInterval;
});
