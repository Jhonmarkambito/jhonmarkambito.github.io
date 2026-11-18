/* ==========================================
   1. THEME SWITCHER WITH LOCALSTORAGE & PARTICLE SYNC
   ========================================== */
const themePalettes = {
  amber:   { particle: '255, 170, 92', line: '255, 122, 26' },
  cyan:    { particle: '103, 232, 249', line: '0, 216, 246' },
  emerald: { particle: '52, 211, 153', line: '16, 185, 129' },
  violet:  { particle: '192, 132, 252', line: '168, 85, 247' }
};

let currentThemePalette = themePalettes.amber;

function switchTheme(themeName) {
  const validTheme = themePalettes[themeName] ? themeName : 'amber';
  document.documentElement.setAttribute('data-theme', validTheme);
  localStorage.setItem('portfolio-theme', validTheme);
  currentThemePalette = themePalettes[validTheme];

  // Update theme dots across desktop & mobile nav
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.classList.toggle('active', dot.getAttribute('data-color') === validTheme);
  });

  playBeep(440, 0.05);
  showToast(`Theme changed to ${validTheme.charAt(0).toUpperCase() + validTheme.slice(1)}!`, '🎨');
}

// Load saved theme on boot
const savedTheme = localStorage.getItem('portfolio-theme') || 'amber';
if (themePalettes[savedTheme]) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  currentThemePalette = themePalettes[savedTheme];
}
document.querySelectorAll('.theme-dot').forEach(dot => {
  dot.classList.toggle('active', dot.getAttribute('data-color') === savedTheme);
});

/* ==========================================
   2. SUBTLE WEB AUDIO SYNTHESIZER
   ========================================== */
let audioContext = null;
let audioEnabled = true;

function getAudioCtx() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioContext = new AudioCtx();
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playBeep(freq = 600, duration = 0.04) {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const btn = document.getElementById('soundToggle');
  if (btn) {
    btn.textContent = audioEnabled ? '🔊' : '🔇';
  }
  showToast(audioEnabled ? 'Sound FX Enabled' : 'Sound FX Muted', audioEnabled ? '🔊' : '🔇');
  if (audioEnabled) playBeep(880, 0.08);
}

/* ==========================================
   3. TOAST NOTIFICATIONS
   ========================================== */
let toastTimeout;
function showToast(message, icon = '✨') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  if (!toast || !toastMsg || !toastIcon) return;

  toastMsg.textContent = message;
  toastIcon.textContent = icon;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================
   4. LIVE CLOCK TELEMETRY
   ========================================== */
function updateClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds} GMT+8`;
}
setInterval(updateClock, 1000);
updateClock();

/* ==========================================
   5. COPY EMAIL & INTERACTIVE RESUME MODAL
   ========================================== */
function copyEmail() {
  const email = document.getElementById('emailText').textContent.trim();
  navigator.clipboard.writeText(email).then(() => {
    playBeep(650, 0.08);
    showToast('Email address copied to clipboard!', '📋');
  }).catch(() => {
    showToast(`Email: ${email}`, '✉️');
  });
}

function openResumeModal() {
  playBeep(620, 0.05);
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div id="printableResume">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; border-bottom:1px solid var(--glass-border); padding-bottom:18px; margin-bottom:20px;">
        <div>
          <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--primary); letter-spacing:0.08em;">Curriculum Vitae Summary</span>
          <h2 style="font-size:1.75rem; color:var(--text-main); margin-top:4px;">Jhon Mark T. Ambito</h2>
          <p style="color:var(--text-muted); font-size:0.9rem;">4th-Year BS Information Technology Student • Bukidnon State University</p>
        </div>
        <div style="font-size:0.82rem; color:var(--text-muted); text-align:right;">
          <div>📧 jhonmark82@gmail.com</div>
          <div>🐙 github.com/Jhonmarkambito</div>
          <div>📍 Bukidnon, Philippines</div>
        </div>
      </div>

      <div style="margin-bottom:18px;">
        <h4 style="font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:8px;">Education</h4>
        <div style="display:flex; justify-content:space-between; font-size:0.92rem; font-weight:600; color:var(--text-main);">
          <span>Bachelor of Science in Information Technology</span>
          <span style="color:var(--text-muted);">2023 – Present (4th Year)</span>
        </div>
        <p style="font-size:0.86rem; color:var(--text-muted);">Bukidnon State University (BukSU) — Malaybalay City, Bukidnon</p>
      </div>

      <div style="margin-bottom:18px;">
        <h4 style="font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:8px;">Selected Technical Projects</h4>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.88rem; color:#cbd5e1;">
          <li><strong style="color:var(--text-main);">BUKSU AI-Powered Student Assistance Chatbot:</strong> Designed and trained a RASA &amp; NLP conversational agent to automate university inquiry handling; authored capstone research manuscript.</li>
          <li><strong style="color:var(--text-main);">PCH Cashier &amp; Inventory Management System:</strong> Built a retail hardware POS and stock-monitoring system managing product SKUs, sales receipts, and inventory levels.</li>
          <li><strong style="color:var(--text-main);">AquaTrack Web Application:</strong> Developed a responsive web application using Laravel Blade templates and MVC architecture.</li>
        </ul>
      </div>

      <div style="margin-bottom:18px;">
        <h4 style="font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:8px;">Certifications &amp; Training</h4>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:6px; font-size:0.88rem; color:#cbd5e1;">
          <li>✦ <strong>CCNA: Switching, Routing, and Wireless Essentials</strong> — Cisco Networking Academy (Dec 2025)</li>
          <li>✦ <strong>Introduction to AI Literacy and Responsible Use</strong> — Micro-Credentials Course, ID: VOGRY4969OAK5 (Sep 2026)</li>
          <li>✦ <strong>DEVCON Sui MoveCodeCamp 2026 (Level 1)</strong> — TypeScript &amp; Web3 Bootcamp Participant (May 2026)</li>
        </ul>
      </div>

      <div style="margin-bottom:24px;">
        <h4 style="font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:8px;">Technical Skills</h4>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          <span class="tech-pill">ReactJS</span>
          <span class="tech-pill">JavaScript (ES6+)</span>
          <span class="tech-pill">TypeScript</span>
          <span class="tech-pill">Node.js</span>
          <span class="tech-pill">Laravel Blade / PHP</span>
          <span class="tech-pill">MongoDB &amp; SQL</span>
          <span class="tech-pill">RASA &amp; NLP</span>
          <span class="tech-pill">Cisco CCNA</span>
          <span class="tech-pill">Git &amp; GitHub</span>
        </div>
      </div>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:10px; border-top:1px solid var(--glass-border); padding-top:18px;">
      <button class="btn btn-primary btn-sm" onclick="printResumeSummary()">🖨️ Print / Save as PDF</button>
      <a href="mailto:jhonmark82@gmail.com?subject=Request%20for%20Full%20CV%20-%20Jhon%20Mark%20Ambito" class="btn btn-secondary btn-sm">✉️ Request Full CV via Email</a>
      <button class="btn btn-secondary btn-sm" onclick="closeProjectModal(null)">Close</button>
    </div>
  `;
  document.getElementById('projectModal').classList.add('open');
}

function downloadCV() {
  openResumeModal();
}

function printResumeSummary() {
  playBeep(680, 0.06);
  const resumeHTML = document.getElementById('printableResume').innerHTML;
  const printWin = window.open('', '_blank', 'width=840,height=900');
  if (!printWin) {
    window.print();
    return;
  }
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Jhon Mark T. Ambito - Resume</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; line-height: 1.55; padding: 36px 48px; max-width: 800px; margin: 0 auto; }
        h2 { margin: 2px 0 4px; color: #111 !important; }
        h4 { color: #c2410c !important; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 18px; }
        p, li, div, span, strong { color: #1f2937 !important; }
        .tech-pill { display: inline-block; border: 1px solid #d1d5db; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
      </style>
    </head>
    <body>
      ${resumeHTML}
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}

/* ==========================================
   6. CONTACT FORM HANDLER (WITH INLINE FALLBACKS)
   ========================================== */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const subject = document.getElementById('userSubject').value.trim();
  const msg = document.getElementById('userMsg').value.trim();

  if (!name || !email || !msg) {
    showToast('Please complete all required fields.', '⚠️');
    return;
  }

  playBeep(700, 0.1);
  const fullText = `${msg}\n\n— ${name} (${email})`;
  const encodedSubj = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(fullText);
  const mailtoUrl = `mailto:jhonmark82@gmail.com?subject=${encodedSubj}&body=${encodedBody}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=jhonmark82@gmail.com&su=${encodedSubj}&body=${encodedBody}`;

  const statusBox = document.getElementById('formStatusBox');
  if (statusBox) {
    statusBox.style.display = 'block';
    statusBox.innerHTML = `
      <div style="font-weight:700; color:#34d399; margin-bottom:6px;">✓ Message Ready to Send!</div>
      <div style="color:var(--text-muted); margin-bottom:10px;">Choose how you'd like to deliver your message to <strong>jhonmark82@gmail.com</strong>:</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        <a href="${gmailUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Send via Gmail Web ↗</a>
        <a href="${mailtoUrl}" class="btn btn-secondary btn-sm">Open Default Mail App</a>
        <button type="button" class="btn btn-secondary btn-sm" id="copyFormMsgBtn">📋 Copy Message</button>
      </div>
    `;
    const copyBtn = document.getElementById('copyFormMsgBtn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(`To: jhonmark82@gmail.com\nSubject: ${subject}\n\n${fullText}`);
        showToast('Formatted message copied to clipboard!', '📋');
      };
    }
  }

  showToast('Message prepared! Choose Gmail or your mail app below.', '✉️');
}

/* ==========================================
   7. MOBILE DRAWER MENU
   ========================================== */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  playBeep(500, 0.04);
}

/* ==========================================
   8. DYNAMIC ROLE ROTATOR (POP-UP ANIMATION)
   ========================================== */
const specializationRoles = [
  "Web Development",
  "ReactJS & TypeScript",
  "Node.js & MongoDB",
  "RASA Chatbots & NLP",
  "Cisco Networking (CCNA)"
];
let roleIndex = 0;
const roleElem = document.getElementById('roleRotator');

if (roleElem) {
  setInterval(() => {
    roleElem.classList.remove('popup-active');
    roleElem.classList.add('popup-enter');

    setTimeout(() => {
      roleIndex = (roleIndex + 1) % specializationRoles.length;
      roleElem.textContent = specializationRoles[roleIndex];

      roleElem.classList.remove('popup-enter');
      roleElem.classList.add('popup-active');
    }, 280);
  }, 3200);
}

/* ==========================================
   9. PROJECT FILTERING & CASE STUDY MODAL
   ========================================== */
function filterProjects(category, btn) {
  playBeep(600, 0.04);
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '1';
      }, 20);
    } else {
      card.style.display = 'none';
    }
  });
}

const projectData = {
  "pch": {
    "title": "PCH Cashier & Inventory Management System",
    "badge": "POS & Inventory System",
    "icon": "🧾",
    "role": "Full-Stack Developer",
    "overview": "Designed and built a tailored cashier and inventory management system for a retail hardware store to replace manual ledger tracking with real-time stock monitoring and fast point-of-sale checkout.",
    "features": [
      "Centralized product catalog with SKU categorization, unit pricing, and supplier details",
      "Point-of-Sale (POS) checkout workflow with automatic receipt computation and change calculation",
      "Real-time stock deduction upon sale completion with low-stock threshold alerts",
      "Sales transaction history and inventory audit logs for business owners"
    ],
    "stack": [
      "POS Architecture",
      "CRUD Operations",
      "Relational Database",
      "Inventory Analytics",
      "UI/UX Design"
    ],
    "link": null
  },
  "chatbot": {
    "title": "BUKSU AI-Powered Student Assistance Chatbot",
    "badge": "Conversational AI & NLP",
    "icon": "🤖",
    "role": "AI/NLP Developer & Lead Researcher",
    "overview": "An intelligent student assistance virtual agent developed for Bukidnon State University using the RASA Open Source framework and Natural Language Processing to answer enrollment, academic, and campus queries 24/7.",
    "features": [
      "Custom NLU training pipeline classifying student intents (enrollment, scholarships, registrar FAQs)",
      "Contextual multi-turn dialogue management and slot filling using RASA Core stories and rules",
      "Fallback handling and confidence scoring to ensure reliable, accurate responses",
      "Documented methodology, system architecture, and evaluation metrics in an academic research manuscript"
    ],
    "stack": [
      "RASA Open Source",
      "Python",
      "Natural Language Processing (NLP)",
      "Intent Classification",
      "Research Manuscript"
    ],
    "link": null
  },
  "aquatrack": {
    "title": "AquaTrack Web Application",
    "badge": "Full-Stack Web Application",
    "icon": "💧",
    "role": "Web Application Developer",
    "overview": "A web application built with Laravel Blade templates and MVC patterns to manage operational tracking, user records, and clean dashboard reporting.",
    "features": [
      "Modular server-rendered views built with Laravel Blade templating engine",
      "Structured MVC routing, form validation, and authenticated dashboard views",
      "Responsive layout optimized for both desktop operators and mobile browsers",
      "Clean separation of presentation logic and backend data persistence"
    ],
    "stack": [
      "Laravel Blade",
      "PHP",
      "MVC Pattern",
      "HTML5 & CSS3",
      "Git Version Control"
    ],
    "link": null
  }
};

function openProjectModal(key) {
  playBeep(650, 0.05);
  const data = projectData[key];
  if (!data) return;

  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
      <div style="font-size:2.4rem;">${data.icon}</div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--primary);">${data.badge} • ${data.role}</span>
        <h2 style="font-size:1.65rem; color:var(--text-main); line-height:1.2; margin-top:2px;">${data.title}</h2>
      </div>
    </div>
    <p style="color:var(--text-muted); font-size:0.96rem; line-height:1.7; margin-bottom:20px;">
      ${data.overview}
    </p>
    <h4 style="font-size:0.95rem; color:var(--text-main); margin-bottom:10px;">Key Capabilities &amp; Engineering Highlights:</h4>
    <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; margin-bottom:24px;">
      ${data.features.map(f => `<li style="font-size:0.9rem; color:#cbd5e1; display:flex; align-items:flex-start; gap:8px;"><span style="color:var(--primary); margin-top:2px;">✦</span> <span>${f}</span></li>`).join('')}
    </ul>
    <h4 style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:10px;">Technologies &amp; Concepts</h4>
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:28px;">
      ${data.stack.map(s => `<span class="tech-pill">${s}</span>`).join('')}
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:12px;">
      ${data.link ? `<a href="${data.link}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Repository ↗</a>` : `<a href="#contact" onclick="closeProjectModal(null)" class="btn btn-primary btn-sm">Inquire / Request Walkthrough →</a>`}
      <button class="btn btn-secondary btn-sm" onclick="closeProjectModal(null)">Close Case Study</button>
    </div>
  `;

  document.getElementById('projectModal').classList.add('open');
}

function closeProjectModal(e) {
  if (!e || e.target.id === 'projectModal' || e.target.classList.contains('modal-close-btn')) {
    playBeep(450, 0.04);
    document.getElementById('projectModal').classList.remove('open');
  }
}

// Global Escape key handler for accessibility
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('projectModal');
    if (modal && modal.classList.contains('open')) {
      closeProjectModal(null);
    }
    if (matrixInterval) {
      stopMatrix();
    }
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      toggleMobileMenu();
    }
  }
});

/* ==========================================
   10. LIVE DEVELOPER TERMINAL INTERACTION
   ========================================== */
function printTermLine(command, output, type = 'output') {
  const termOutput = document.getElementById('termOutput');
  const block = document.createElement('div');
  block.className = 'term-line';

  block.innerHTML = `
    <div class="term-prompt">
      <span class="user-host">guest@jhonmark:~$</span> ${escapeHTML(command)}
    </div>
    <div class="term-output ${type}">${output}</div>
  `;
  termOutput.appendChild(block);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function termCommand(cmd) {
  const cleanCmd = cmd.trim();
  const parts = cleanCmd.toLowerCase().split(' ');
  const action = parts[0];
  const arg = parts[1];

  playBeep(550, 0.04);

  switch (action) {
    case 'help':
      printTermLine(cleanCmd, `
Available Commands:
  • help              - Display this list of interactive commands
  • projects          - List my featured projects & case studies
  • skills            - View categorized technical capabilities
  • resume            - Open my interactive Resume / CV summary modal
  • certs             - List my completed certifications
  • whoami            - Display developer profile info
  • theme <color>     - Switch theme live (amber, cyan, emerald, violet)
  • matrix            - Run animated full-screen green cyber matrix rain
  • contact           - View direct contact info and email
  • clear             - Clean terminal screen history
      `, 'highlight');
      break;

    case 'projects':
      printTermLine(cleanCmd, `
Featured Projects:
  [1] PCH Cashier & Inventory Management System   -> POS, CRUD, Inventory DB
  [2] BUKSU AI-Powered Student Assistance Chatbot -> RASA, Python, NLP
  [3] AquaTrack Web Application                   -> Laravel Blade, PHP, MVC
* GitHub: https://github.com/Jhonmarkambito
      `, 'success');
      break;

    case 'skills':
      printTermLine(cleanCmd, `
Technical Stack:
  [Frontend]  ReactJS, JavaScript (ES6+), TypeScript, HTML5/CSS3, Blade
  [Backend]   Node.js, PHP / MVC
  [Database]  MongoDB, Relational SQL
  [AI & Net]  RASA Open Source, NLP Pipelines, Cisco CCNA Networking
  [Tools]     Git, GitHub, Visual Studio Code
      `, 'highlight');
      break;

    case 'resume':
    case 'cv':
      printTermLine(cleanCmd, `Opening interactive Resume Summary Modal...`, 'success');
      openResumeModal();
      break;

    case 'certs':
      printTermLine(cleanCmd, `
Verified Certificates:
  • Introduction to AI Literacy and Responsible Use (14 Sep 2026 | ID: VOGRY4969OAK5)
  • CCNA: Switching, Routing, and Wireless Essentials (03 Dec 2025 | Cisco NetAcad)
      `, 'success');
      break;

    case 'whoami':
      printTermLine(cleanCmd, `
Jhon Mark T. Ambito
4th-year BS Information Technology student @ Bukidnon State University
Focus: Full-Stack Web Apps, POS/Inventory Systems, RASA NLP Chatbots & Networking
Status: Open for OJT / Internship & Junior Developer roles
      `, 'success');
      break;

    case 'theme':
      if (['amber', 'cyan', 'emerald', 'violet'].includes(arg)) {
        switchTheme(arg);
        printTermLine(cleanCmd, `Theme accent switched live to: ${arg.toUpperCase()}!`, 'success');
      } else {
        printTermLine(cleanCmd, `Invalid theme '${arg || ''}'. Options: amber, cyan, emerald, violet`, 'error');
      }
      break;

    case 'matrix':
      printTermLine(cleanCmd, `Initializing Cyber Matrix Rain... (Click anywhere or press Esc to exit)`, 'success');
      startMatrix();
      break;

    case 'contact':
      printTermLine(cleanCmd, `
Direct Contact:
  • Email:    jhonmark82@gmail.com
  • GitHub:   https://github.com/Jhonmarkambito
      `, 'highlight');
      break;

    case 'clear':
      document.getElementById('termOutput').innerHTML = `
        <div class="term-line">
          <div class="term-output highlight">Terminal cleared. Type 'help' for commands.</div>
        </div>
      `;
      break;

    case '':
      break;

    default:
      printTermLine(cleanCmd, `Command not recognized: '${cleanCmd}'. Type 'help' for available commands.`, 'error');
  }
}

function handleTermKey(e) {
  if (e.key === 'Enter') {
    submitTermInput();
  }
}

function submitTermInput() {
  const input = document.getElementById('termInput');
  const val = input.value;
  if (!val.trim()) return;
  termCommand(val);
  input.value = '';
}

/* ==========================================
   11. MATRIX RAIN EFFECT
   ========================================== */
let matrixInterval = null;
function startMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  canvas.style.display = 'block';

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const letters = '0123456789ABCDEFHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテト';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  if (matrixInterval) clearInterval(matrixInterval);

  matrixInterval = setInterval(() => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff66';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 35);

  showToast('Cyber Matrix Running! Click terminal or press Esc to close.', '🟢');
}

function stopMatrix() {
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = null;
  }
  document.getElementById('matrixCanvas').style.display = 'none';
  showToast('Matrix effect closed', '✕');
}

/* ==========================================
   12. LIVE SPOTIFY AUDIO SYNTHESIZER
   ========================================== */
const playlist = [
  { title: "Ambient Chord 1", artist: "Browser synth", rootFreq: 220 },
  { title: "Ambient Chord 2", artist: "Browser synth", rootFreq: 261.63 },
  { title: "Ambient Chord 3", artist: "Browser synth", rootFreq: 196 }
];
let currentTrackIdx = 0;
let isPlayingMusic = false;
let musicOscillators = [];
let progressTimer = null;
let trackSeconds = 0;

function toggleMusicWidget() {
  const widget = document.getElementById('spotifyWidget');
  widget.classList.toggle('minimized');
  playBeep(520, 0.04);
}

function togglePlayMusic() {
  isPlayingMusic = !isPlayingMusic;
  const playBtn = document.getElementById('playBtn');
  const disc = document.getElementById('musicDisc');
  const eq = document.getElementById('eqBars');

  if (isPlayingMusic) {
    playBtn.textContent = '⏸';
    disc.classList.add('playing');
    eq.classList.add('active');
    startSynthAudio();
    startProgressTimer();
    showToast(`Now Playing: ${playlist[currentTrackIdx].title}`, '🎧');
  } else {
    playBtn.textContent = '▶';
    disc.classList.remove('playing');
    eq.classList.remove('active');
    stopSynthAudio();
    stopProgressTimer();
    showToast('Playback Paused', '⏸');
  }
}

function nextTrack() {
  currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
  updateTrackDisplay();
  if (isPlayingMusic) {
    stopSynthAudio();
    startSynthAudio();
  }
}

function prevTrack() {
  currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
  updateTrackDisplay();
  if (isPlayingMusic) {
    stopSynthAudio();
    startSynthAudio();
  }
}

function updateTrackDisplay() {
  const track = playlist[currentTrackIdx];
  document.getElementById('trackTitle').textContent = track.title;
  document.getElementById('trackArtist').textContent = track.artist;
  trackSeconds = 0;
  document.getElementById('trackProgress').style.width = '0%';
  playBeep(620, 0.05);
}

function startSynthAudio() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    stopSynthAudio();
    const root = playlist[currentTrackIdx].rootFreq;
    const freqs = [root, root * 1.25, root * 1.5, root * 1.875]; // Major 7th chord

    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      musicOscillators.push({ osc, gain });
    });
  } catch (e) {}
}

function stopSynthAudio() {
  musicOscillators.forEach(item => {
    try {
      item.gain.gain.exponentialRampToValueAtTime(0.0001, getAudioCtx().currentTime + 0.1);
      item.osc.stop(getAudioCtx().currentTime + 0.1);
    } catch (e) {}
  });
  musicOscillators = [];
}

function startProgressTimer() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    trackSeconds = (trackSeconds + 1) % 180;
    const pct = (trackSeconds / 180) * 100;
    document.getElementById('trackProgress').style.width = pct + '%';
    if (trackSeconds === 0) nextTrack();
  }, 1000);
}

function stopProgressTimer() {
  if (progressTimer) clearInterval(progressTimer);
}

/* ==========================================
   13. SKILLS TABS
   ========================================== */
function switchSkillTab(category, btn) {
  playBeep(580, 0.04);
  document.querySelectorAll('.skill-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.skills-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const activePanel = document.getElementById(`skill-${category}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }
}

/* ==========================================
   14. MOUSE-TRACKING AMBIENT GLOW
   ========================================== */
const ambientGlow = document.getElementById('ambientGlow');
window.addEventListener('mousemove', (e) => {
  if (!ambientGlow) return;
  ambientGlow.style.left = e.clientX + 'px';
  ambientGlow.style.top = e.clientY + 'px';
});

/* ==========================================
   15. INTERACTIVE CANVAS PARTICLES (THEME-SYNCED)
   ========================================== */
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 45;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
    this.baseAlpha = Math.random() * 0.4 + 0.15;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${currentThemePalette.particle}, ${this.baseAlpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${currentThemePalette.line}, ${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==========================================
   16. ACTIVE SCROLL SPY
   ========================================== */
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 180;
    if (window.scrollY >= top) {
      currentSection = sec.getAttribute('id');
    }
  });
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    }
  });
});

/* ==========================================
   17. ENHANCED AI ASSISTANT (CHATBOT 2.0)
   ========================================== */
function toggleChat() {
  const box = document.getElementById('chatBox');
  box.classList.toggle('open');
  playBeep(box.classList.contains('open') ? 700 : 450, 0.05);

  if (box.classList.contains('open')) {
    document.getElementById('chatBadge').style.display = 'none';
    document.getElementById('chatInput').focus();
  }
}

function clearChat() {
  playBeep(400, 0.04);
  document.getElementById('chatMsgs').innerHTML = `
    <div class="msg bot">
      Conversation refreshed! How can I assist you today regarding Jhon Mark's work?
    </div>
    <div class="typing-indicator" id="typingIndicator">
      <span></span><span></span><span></span>
    </div>
  `;
}

const aiKnowledgeBase = [
  { patterns: [/^(hi|hello|hey|greetings|good (morning|evening))\b/i], answer: "Hello! 👋 I'm Jhon Mark's portfolio assistant. Ask me about his projects, skills, certificates, resume, or how to contact him." },
  { patterns: [/who is jhon|about jhon|bio|background|who are you|student|about/i], answer: "Jhon Mark T. Ambito is a 4th-year BS Information Technology student at **Bukidnon State University** building full-stack web apps, POS/inventory systems, and RASA NLP chatbots." },
  { patterns: [/project|built|showcase|app\b|chatbot|aquatrack|pch|cashier/i], answer: "His featured projects are:\n1. **PCH Cashier & Inventory Management System** (POS & stock tracking)\n2. **BUKSU AI-Powered Student Assistance Chatbot** (RASA & Python NLP)\n3. **AquaTrack Web Application** (Laravel Blade & MVC)\nClick **Read Case Study** on any project card for full details!" },
  { patterns: [/skill|tech|stack|language|framework|react|node|mongo|javascript|git/i], answer: "He works with **ReactJS, JavaScript (ES6+), TypeScript, Node.js, Laravel Blade/PHP, MongoDB, RASA Open Source, NLP, Cisco CCNA networking, and Git/GitHub**." },
  { patterns: [/experience|journey|study|studied|school|university|history|education/i], answer: "Jhon is a 4th-year BSIT student at Bukidnon State University (2023–Present). Check out the **Journey** section for his 2023–2026 project and research milestones." },
  { patterns: [/certificat|credential|cisco|ccna|literacy|ched/i], answer: "He holds verified certificates in **CCNA: Switching, Routing, and Wireless Essentials** (Cisco Networking Academy, Dec 2025) and **Introduction to AI Literacy and Responsible Use** (Sep 2026). Both PDFs are viewable in the Certificates section." },
  { patterns: [/terminal|cli|command/i], answer: "Try the **Live Developer Terminal** on the page — type `help`, `projects`, `skills`, `resume`, `certs`, or `matrix`." },
  { patterns: [/contact|email|hire|reach|available|ojt|internship/i], answer: "Jhon is open for OJT/internships and developer opportunities! Email him at **jhonmark82@gmail.com**, use the Contact form, or check his GitHub at **Jhonmarkambito**." },
  { patterns: [/cv|resume|download/i], answer: "Click **View Resume** in the Hero section (or type `resume` in the Live Terminal) to open his printable CV summary right on the page!" },
  { patterns: [/location|where|country/i], answer: "Jhon is based in Bukidnon, Philippines and studies at Bukidnon State University." }
];

function askQuickPrompt(text) {
  document.getElementById('chatInput').value = text;
  sendChat();
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const msgs = document.getElementById('chatMsgs');
  const indicator = document.getElementById('typingIndicator');

  const userBubble = document.createElement('div');
  userBubble.className = 'msg user';
  userBubble.textContent = text;
  msgs.insertBefore(userBubble, indicator);
  input.value = '';

  playBeep(800, 0.04);
  msgs.scrollTop = msgs.scrollHeight;

  indicator.style.display = 'flex';
  msgs.scrollTop = msgs.scrollHeight;

  let reply = "I don't have that exact detail, but you can explore Jhon's **Projects**, **Skills**, and **Resume** above, or email him directly at **jhonmark82@gmail.com**!";

  for (const item of aiKnowledgeBase) {
    if (item.patterns.some(p => p.test(text))) {
      reply = item.answer;
      break;
    }
  }

  setTimeout(() => {
    indicator.style.display = 'none';

    const botBubble = document.createElement('div');
    botBubble.className = 'msg bot';
    botBubble.innerHTML = reply
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
    msgs.insertBefore(botBubble, indicator);

    playBeep(550, 0.05);
    msgs.scrollTop = msgs.scrollHeight;
  }, 550);
}
