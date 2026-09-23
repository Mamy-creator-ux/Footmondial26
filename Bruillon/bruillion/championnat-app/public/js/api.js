// ===== Wrapper Fetch API pour communiquer avec le back-end Express =====
const API_BASE = '/api';

function getToken() { return localStorage.getItem('token'); }
function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}
function isLoggedIn() { return !!getToken(); }
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch { /* pas de corps JSON */ }

  if (!res.ok) {
    throw new Error((data && data.message) || `Erreur ${res.status}`);
  }
  return data;
}

// ===== Rendu dynamique du header (connexion / rôle / notifications) =====
function renderHeader(activePage) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const user = getUser();
  const links = [
    ['index.html', 'Accueil'],
    ['equipes.html', 'Équipes'],
    ['calendrier.html', 'Calendrier'],
    ['classement.html', 'Classement'],
    ['statistiques.html', 'Statistiques']
  ];
  if (user && user.role === 'admin') links.push(['admin.html', 'Administration']);

  const navHtml = links.map(([href, label]) =>
    `<a href="${href}" class="${activePage === href ? 'active' : ''}">${label}</a>`
  ).join('');

  const actionsHtml = user
    ? `<button class="bell-btn" id="bell-btn">🔔<span class="badge-count" id="notif-count" style="display:none">0</span></button>
       <span style="color:var(--gris);font-size:13px;">${user.nom} · ${user.role}</span>
       <button class="btn btn-ghost btn-sm" id="logout-btn">Déconnexion</button>`
    : `<a class="btn btn-ghost btn-sm" href="connexion.html">Connexion</a>
       <a class="btn btn-primary btn-sm" href="inscription.html">Inscription</a>`;

  header.innerHTML = `
    <a class="brand" href="index.html">
      <span class="mark">MONDIAL26</span>
      <span class="sub">GESTION DU CHAMPIONNAT</span>
    </a>
    <nav class="main-nav">${navHtml}</nav>
    <div class="header-actions">${actionsHtml}</div>
    <div id="notif-panel"></div>
  `;

  if (user) {
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('bell-btn').addEventListener('click', toggleNotifPanel);
    loadNotifications();
  }
}

async function loadNotifications() {
  try {
    const notifs = await apiFetch('/notifications');
    const unread = notifs.filter(n => !n.lue).length;
    const countEl = document.getElementById('notif-count');
    if (countEl) {
      countEl.style.display = unread ? 'flex' : 'none';
      countEl.textContent = unread;
    }
    const panel = document.getElementById('notif-panel');
    if (panel) {
      panel.innerHTML = notifs.length
        ? notifs.map(n => `<div class="notif-item">${n.message}<small>${new Date(n.creeLe).toLocaleString('fr-FR')}</small></div>`).join('')
        : '<div class="notif-item">Aucune notification pour le moment.</div>';
    }
  } catch (e) { /* silencieux */ }
}

function toggleNotifPanel() {
  document.getElementById('notif-panel').classList.toggle('open');
}

// Ferme le panneau de notifications si on clique ailleurs
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notif-panel');
  const bell = document.getElementById('bell-btn');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && e.target !== bell) {
    panel.classList.remove('open');
  }
});
