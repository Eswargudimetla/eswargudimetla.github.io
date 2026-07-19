/* ==========================================================================
   TRENDING PORTFOLIO SYSTEM SCRIPT - ESWAR GUDIMETLA (2026)
   Interactivity: Three.js 3D Graphics, Computer Vision HUD Simulator, 
   CLI Terminal Emulator, Command Palette (Cmd+K), Spotlight Glow, Project Filters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initThemeSystem();
  initCardSpotlightTracker();
  initHeroThreeJS();
  initCVSimulator();
  initCLITerminal();
  initProjectSystem();
  initSkills3DChart();
  initCommandPalette();
  initToastSystem();
  initScrollAnimations();
});

/* ==========================================================================
   1. THEME SWITCHER SYSTEM
   ========================================================================== */
function initThemeSystem() {
  const currentTheme = localStorage.getItem('eswar_portfolio_theme') || 'default';
  document.documentElement.setAttribute('data-theme', currentTheme);

  window.setTheme = function(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('eswar_portfolio_theme', themeName);
    showToast(`Theme switched to ${themeName.toUpperCase()}`);
  };
}

/* ==========================================================================
   2. CARD SPOTLIGHT GLOW TRACKER
   ========================================================================== */
function initCardSpotlightTracker() {
  const cards = document.querySelectorAll('.bento-card, .metric-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. HERO THREE.JS NEURAL PARTICLE NETWORK
   ========================================================================== */
function initHeroThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || !window.THREE) return;

  const container = document.querySelector('.hero-section');
  let width = container.clientWidth;
  let height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Neural Nodes
  const nodeCount = 65;
  const positions = new Float32Array(nodeCount * 3);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * 18;
    const y = (Math.random() - 0.5) * 12;
    const z = (Math.random() - 0.5) * 10;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    nodes.push({
      pos: new THREE.Vector3(x, y, z),
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.008)
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 0.18,
    transparent: true,
    opacity: 0.85
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Connecting Dynamic Synapse Lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.22
  });

  let lineSegments;

  function updateLines() {
    if (lineSegments) scene.remove(lineSegments);

    const linePositions = [];
    const maxDist = 3.8;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < maxDist) {
          linePositions.push(
            nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z,
            nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    lineSegments = new THREE.LineSegments(lineGeo, lineMaterial);
    scene.add(lineSegments);
  }

  // Mouse interactivity
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Update positions
    const posArr = particleGeo.attributes.position.array;
    for (let i = 0; i < nodeCount; i++) {
      nodes[i].pos.add(nodes[i].vel);

      // Bounce boundaries
      if (Math.abs(nodes[i].pos.x) > 9) nodes[i].vel.x *= -1;
      if (Math.abs(nodes[i].pos.y) > 6) nodes[i].vel.y *= -1;
      if (Math.abs(nodes[i].pos.z) > 5) nodes[i].vel.z *= -1;

      posArr[i * 3] = nodes[i].pos.x;
      posArr[i * 3 + 1] = nodes[i].pos.y;
      posArr[i * 3 + 2] = nodes[i].pos.z;
    }
    particleGeo.attributes.position.needsUpdate = true;

    updateLines();

    scene.rotation.y += 0.0012 + mouseX * 0.01;
    scene.rotation.x += mouseY * 0.01;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ==========================================================================
   4. INTERACTIVE REAL-TIME COMPUTER VISION SIMULATOR
   ========================================================================== */
function initCVSimulator() {
  const canvas = document.getElementById('cvCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let mode = 'gesture'; // 'gesture', 'parking', 'thermal'
  let animationFrameId;

  // Set canvas dimensions
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // CV Mode Selector Buttons
  const btns = document.querySelectorAll('.cv-mode-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      const modeLabel = document.getElementById('cvCurrentModeText');
      if (modeLabel) {
        modeLabel.textContent = mode === 'gesture' ? 'HAND_GESTURE_TRACKER' :
                               mode === 'parking' ? 'PARKING_SLOT_CV' : 'DEPTH_MAP_HEATMAP';
      }
    });
  });

  // Simulated CV Objects State
  let angle = 0;

  function renderCVFrame() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    angle += 0.03;

    // Grid lines background for camera feed effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    if (mode === 'gesture') {
      // Hand landmark tracking simulation
      const centerX = w / 2 + Math.sin(angle) * (w * 0.15);
      const centerY = h / 2 + Math.cos(angle * 0.8) * (h * 0.12);

      // Landmark Joint Points
      const joints = [
        { x: centerX, y: centerY + 60 }, // wrist
        { x: centerX - 30, y: centerY + 20 }, { x: centerX - 45, y: centerY - 20 }, // thumb
        { x: centerX - 15, y: centerY - 30 }, { x: centerX - 20, y: centerY - 70 }, // index
        { x: centerX + 10, y: centerY - 35 }, { x: centerX + 12, y: centerY - 78 }, // middle
        { x: centerX + 30, y: centerY - 30 }, { x: centerX + 38, y: centerY - 65 }, // ring
        { x: centerX + 50, y: centerY - 10 }, { x: centerX + 60, y: centerY - 45 }  // pinky
      ];

      // Draw skeleton connecting lines
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(joints[0].x, joints[0].y);
      joints.forEach(j => ctx.lineTo(j.x, j.y));
      ctx.stroke();

      // Draw Joint Nodes
      joints.forEach((j, i) => {
        ctx.fillStyle = i % 2 === 0 ? '#8b5cf6' : '#22d3ee';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cursor Bounding Box
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(centerX - 80, centerY - 100, 160, 180);
      ctx.setLineDash([]);

      // Label Overlay
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText('GESTURE: PINCH_CLICK (99.2%)', centerX - 75, centerY - 110);

    } else if (mode === 'parking') {
      // Parking space occupancy detection boxes
      const rows = 2;
      const cols = 3;
      const slotW = w * 0.22;
      const slotH = h * 0.32;
      const startX = w * 0.12;
      const startY = h * 0.15;

      let slotIdx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slotIdx++;
          const sx = startX + c * (slotW + 20);
          const sy = startY + r * (slotH + 20);

          // Alternating occupied / vacant status based on sine angle
          const isOccupied = Math.sin(angle + slotIdx * 1.5) > 0;

          ctx.strokeStyle = isOccupied ? '#ef4444' : '#10b981';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, sy, slotW, slotH);

          ctx.fillStyle = isOccupied ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)';
          ctx.fillRect(sx, sy, slotW, slotH);

          ctx.fillStyle = isOccupied ? '#ef4444' : '#10b981';
          ctx.font = '11px "JetBrains Mono"';
          ctx.fillText(`SLOT ${slotIdx}: ${isOccupied ? 'OCCUPIED' : 'VACANT'}`, sx + 8, sy + 20);
        }
      }
    } else if (mode === 'thermal') {
      // Heatmap thermal visualizer simulation
      const gradient = ctx.createRadialGradient(
        w / 2 + Math.sin(angle) * 80, h / 2 + Math.cos(angle) * 40, 10,
        w / 2, h / 2, w * 0.4
      );
      gradient.addColorStop(0, 'rgba(244, 63, 94, 0.7)');
      gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.5)');
      gradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
      gradient.addColorStop(1, 'rgba(13, 17, 28, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText('HEATMAP_INTENSITY: 87.4°C MAX', 20, h - 20);
    }

    // Scanning Line Bar Overlay
    const scanY = (Math.sin(angle * 0.7) * 0.5 + 0.5) * h;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(w, scanY);
    ctx.stroke();

    animationFrameId = requestAnimationFrame(renderCVFrame);
  }

  renderCVFrame();
}

/* ==========================================================================
   5. INTERACTIVE CLI TERMINAL EMULATOR
   ========================================================================== */
function initCLITerminal() {
  const body = document.getElementById('termBody');
  const input = document.getElementById('termInput');
  if (!body || !input) return;

  const commands = {
    help: 'Available commands: bio, skills, projects, experience, contact, hire, theme, clear',
    bio: 'Eswar Sai Chandra Reddy Gudimetla | AI Engineer @ Rebecca Everlene Trust Co. | M.S. Computer Science @ Saint Louis University.',
    skills: 'AI/ML: Python, OpenCV, MediaPipe, TensorFlow, Keras. Cloud: AWS, Docker, Kubernetes, SQL. DSA & OOP.',
    projects: '1. Hand Gesture Cursor | 2. Parking CV | 3. Stock Prediction | 4. DriveLink | 5. SLU Insta | 6. Gym App',
    experience: 'AI Engineer (Present) | Research Assistant @ GITAM (2022-23) | Cloud DevOps Intern @ Phoenix Global (2022)',
    contact: 'Phone: +1 (314) 766-3166 | LinkedIn & GitHub: @Eswargudimetla',
    hire: 'Ready to join your team across USA! Email or connect via phone +1 (314) 766-3166.',
    theme: 'Themes available: setTheme("default"), setTheme("emerald"), setTheme("amber"), setTheme("light")'
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';

      if (!cmd) return;

      appendLine(`$ ${cmd}`, 'prompt');

      if (cmd === 'clear') {
        body.innerHTML = '';
        return;
      }

      if (cmd === 'hire') {
        triggerConfetti();
      }

      const response = commands[cmd] || `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
      appendLine(response, 'output');
      body.scrollTop = body.scrollHeight;
    }
  });

  function appendLine(text, type) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = type === 'prompt' ? `<span class="prompt">$</span> <span class="output">${text.substring(2)}</span>` : text;
    body.appendChild(line);
  }

  window.runTermCmd = function(cmd) {
    input.value = cmd;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(event);
  };
}

/* ==========================================================================
   6. PROJECTS SYSTEM & DETAILS MODAL
   ========================================================================== */
function initProjectSystem() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. 3D SKILLS BAR CHART USING THREE.JS
   ========================================================================== */
function initSkills3DChart() {
  const canvas = document.getElementById('skills3dCanvas');
  if (!canvas || !window.THREE) return;

  const skillsData = [
    { name: 'Python', score: 0.93, color: 0x8b5cf6 },
    { name: 'OpenCV', score: 0.88, color: 0x8b5cf6 },
    { name: 'TensorFlow', score: 0.85, color: 0x8b5cf6 },
    { name: 'AWS', score: 0.82, color: 0x06b6d4 },
    { name: 'SQL', score: 0.80, color: 0x06b6d4 },
    { name: 'Docker', score: 0.76, color: 0x06b6d4 },
    { name: 'Kubernetes', score: 0.70, color: 0x06b6d4 },
    { name: 'JavaScript', score: 0.75, color: 0xec4899 },
    { name: 'Git / CI-CD', score: 0.78, color: 0xec4899 }
  ];

  let width = canvas.clientWidth;
  let height = 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 5, 11);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(5, 10, 7);
  scene.add(light);

  const group = new THREE.Group();
  const cols = 3, rows = 3, spacing = 2.4;

  skillsData.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const barHeight = item.score * 4.5;

    const geo = new THREE.BoxGeometry(1.1, barHeight, 1.1);
    const mat = new THREE.MeshStandardMaterial({
      color: item.color,
      roughness: 0.3,
      metalness: 0.2
    });

    const bar = new THREE.Mesh(geo, mat);
    bar.position.set((col - cols / 2 + 0.5) * spacing, barHeight / 2, (row - rows / 2 + 0.5) * spacing);
    group.add(bar);
  });

  const grid = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
  group.add(grid);
  scene.add(group);

  // Mouse Drag Rotation
  let isDragging = false, prevX = 0, rotY = 0.4;
  group.rotation.y = rotY;

  canvas.addEventListener('pointerdown', (e) => { isDragging = true; prevX = e.clientX; });
  window.addEventListener('pointerup', () => { isDragging = false; });
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    rotY += dx * 0.006;
    prevX = e.clientX;
  });

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (rotY - group.rotation.y) * 0.1;
    if (!isDragging) rotY += 0.002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    width = canvas.clientWidth;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ==========================================================================
   8. COMMAND PALETTE SYSTEM (Cmd+K / Ctrl+K)
   ========================================================================== */
function initCommandPalette() {
  const backdrop = document.getElementById('cmdBackdrop');
  const input = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResults');
  if (!backdrop || !input) return;

  window.toggleCmdPalette = function() {
    backdrop.classList.toggle('active');
    if (backdrop.classList.contains('active')) {
      input.value = '';
      input.focus();
      renderCmdItems('');
    }
  };

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleCmdPalette();
    }
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      toggleCmdPalette();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) toggleCmdPalette();
  });

  const cmdItems = [
    { title: 'Go to About Section', action: () => scrollToSection('#about') },
    { title: 'Go to Experience Timeline', action: () => scrollToSection('#experience') },
    { title: 'Go to Projects Showcase', action: () => scrollToSection('#projects') },
    { title: 'Go to Skills & 3D Chart', action: () => scrollToSection('#skills') },
    { title: 'Go to Contact Hub', action: () => scrollToSection('#contact') },
    { title: 'Copy Phone Number (+1 314-766-3166)', action: () => copyToClipboard('+13147663166', 'Phone Number') },
    { title: 'Copy LinkedIn URL', action: () => copyToClipboard('https://www.linkedin.com/in/eswar-sai-chandra-reddy-gudimetla-255970227/', 'LinkedIn URL') },
    { title: 'Switch Theme: Cyber Violet (Default)', action: () => setTheme('default') },
    { title: 'Switch Theme: Cyber Emerald', action: () => setTheme('emerald') },
    { title: 'Switch Theme: Solar Amber', action: () => setTheme('amber') },
    { title: 'Switch Theme: Clean Light', action: () => setTheme('light') },
    { title: 'Trigger Celebration Confetti 🚀', action: () => triggerConfetti() }
  ];

  function renderCmdItems(query) {
    results.innerHTML = '';
    const filtered = cmdItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

    filtered.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = `cmd-item ${index === 0 ? 'selected' : ''}`;
      div.textContent = item.title;
      div.addEventListener('click', () => {
        item.action();
        toggleCmdPalette();
      });
      results.appendChild(div);
    });
  }

  input.addEventListener('input', (e) => renderCmdItems(e.target.value));

  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   9. TOAST & UTILITIES
   ========================================================================== */
function initToastSystem() {
  window.showToast = function(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`);
    });
  };

  window.triggerConfetti = function() {
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      showToast(' 🎉 Celebration!');
    }
  };
}

/* ==========================================================================
   10. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.bento-card, .section-head, .timeline-item, .fact-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
