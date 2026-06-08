const API_URL = "http://localhost:8080/api";

const state = {
  profs: [],
  ues: [],
  cours: [],
  seminaires: []
};


document.addEventListener("DOMContentLoaded", () => {
  buildCalendarGrid();
  goToToday();
  loadDataFromJava();
});

async function loadDataFromJava() {
  try {
    const [resProfs, resUes, resCours, resSeminaires] = await Promise.all([
      fetch(`${API_URL}/profs`),
      fetch(`${API_URL}/ues`),
      fetch(`${API_URL}/cours`),
      fetch(`${API_URL}/seminaires`)
    ]);

    state.profs      = await resProfs.json();
    state.ues        = await resUes.json();
    state.cours      = await resCours.json();
    state.seminaires = await resSeminaires.json();

    renderProfsList();
    renderUesList();
    renderCoursList();
    renderSeminairesList();
    renderCalendarEvents();
    populateSelects();
    updateCounts();
  } catch (err) {
    console.error("Erreur de synchronisation avec Java :", err);
    toast("Erreur : Impossible de se connecter au serveur Java ❌");
  }
}


async function saveProf() {
  const nom    = document.getElementById('prof-nom').value.trim();
  const prenom = document.getElementById('prof-prenom').value.trim();
  const age    = parseInt(document.getElementById('prof-age').value);
  const genre  = document.getElementById('prof-genre').value;

  if (!nom || !prenom || isNaN(age)) {
    toast('Veuillez remplir tous les champs du professeur');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/profs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, age, genre })
    });
    if (res.ok) {
      toast('Professeur enregistré ✓');
      document.getElementById('prof-nom').value    = '';
      document.getElementById('prof-prenom').value = '';
      document.getElementById('prof-age').value    = '';
      closeModal();
      await loadDataFromJava();
    }
  } catch (err) {
    toast('Erreur de sauvegarde côté serveur ❌');
  }
}


async function saveUE() {
  const matiere = document.getElementById('ue-matiere').value.trim();
  const credit  = parseInt(document.getElementById('ue-credit').value);

  if (!matiere || isNaN(credit)) {
    toast("Veuillez remplir tous les champs de l'UE");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/ues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matiere, credit })
    });
    if (res.ok) {
      toast('UE enregistrée ✓');
      document.getElementById('ue-matiere').value = '';
      document.getElementById('ue-credit').value  = '';
      closeModal();
      await loadDataFromJava();
    }
  } catch (err) {
    toast('Erreur de sauvegarde côté serveur ❌');
  }
}


async function saveCours() {
  const debut     = document.getElementById('cours-debut').value;
  const fin       = document.getElementById('cours-fin').value;
  const ueMatiere = document.getElementById('cours-ue').value;
  const profNom   = document.getElementById('cours-prof').value;

  if (!debut || !fin || !ueMatiere || !profNom) {
    toast('Veuillez remplir tous les champs du cours');
    return;
  }

  const ue   = state.ues.find(u => u.matiere === ueMatiere);
  const prof = state.profs.find(p => p.nom === profNom);

  try {
    const res = await fetch(`${API_URL}/cours`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heureDebut: debut, heureFin: fin, ue, prof })
    });
    if (res.ok) {
      toast('Cours ajouté ✓');
      closeModal();
      await loadDataFromJava();
    }
  } catch (err) {
    toast("Erreur lors de l'enregistrement du cours ❌");
  }
}


async function saveSeminaire() {
  const debut   = document.getElementById('sem-debut').value;
  const fin     = document.getElementById('sem-fin').value;
  const respNom = document.getElementById('sem-responsable').value;
  const titre   = document.getElementById('sem-titre').value.trim();

  if (!debut || !fin || !respNom || !titre) {
    toast('Veuillez remplir tous les champs du séminaire');
    return;
  }

  const responsable = state.profs.find(p => p.nom === respNom);

  try {
    const res = await fetch(`${API_URL}/seminaires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heureDebut: debut, heureFin: fin, responsable, titre })
    });
    if (res.ok) {
      toast('Séminaire ajouté ✓');
      closeModal();
      await loadDataFromJava();
    }
  } catch (err) {
    toast("Erreur lors de l'enregistrement du séminaire ❌");
  }
}

async function saveEvent() {
  if (currentEventType === 'cours') {
    
    document.getElementById('cours-debut').value = document.getElementById('ev-cours-debut').value;
    document.getElementById('cours-fin').value   = document.getElementById('ev-cours-fin').value;
    document.getElementById('cours-ue').value    = document.getElementById('ev-cours-ue').value;
    document.getElementById('cours-prof').value  = document.getElementById('ev-cours-prof').value;
    await saveCours();
  } else {
    document.getElementById('sem-debut').value       = document.getElementById('ev-sem-debut').value;
    document.getElementById('sem-fin').value         = document.getElementById('ev-sem-fin').value;
    document.getElementById('sem-responsable').value = document.getElementById('ev-sem-responsable').value;
    document.getElementById('sem-titre').value       = document.getElementById('ev-sem-titre').value;
    await saveSeminaire();
  }
}

async function deleteCours(id) {
  try {
    const res = await fetch(`${API_URL}/cours/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Cours supprimé ✓'); await loadDataFromJava(); }
  } catch { toast('Erreur lors de la suppression ❌'); }
}

async function deleteSeminaire(id) {
  try {
    const res = await fetch(`${API_URL}/seminaires/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Séminaire supprimé ✓'); await loadDataFromJava(); }
  } catch { toast('Erreur lors de la suppression ❌'); }
}

async function deleteProf(id) {
  try {
    await fetch(`${API_URL}/profs/${id}`, { method: 'DELETE' });
    toast('Professeur supprimé ✓');
    await loadDataFromJava();
  } catch { toast('Erreur lors de la suppression ❌'); }
}

async function deleteUE(id) {
  try {
    await fetch(`${API_URL}/ues/${id}`, { method: 'DELETE' });
    toast('UE supprimée ✓');
    await loadDataFromJava();
  } catch { toast('Erreur lors de la suppression ❌'); }
}

function renderProfsList() {
  const el = document.getElementById('profs-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.profs.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>Aucun professeur enregistré.</p></div>';
    return;
  }

  state.profs.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card type-prof';
    card.innerHTML = `
      <div class="card-badge badge-prof">Professeur</div>
      <div class="card-title">${p.prenom} ${p.nom}</div>
      <div class="card-meta">
        <span>${p.age} ans</span>
        <span>${p.genre}</span>
      </div>
      <div class="card-actions">
        <button class="btn-icon-sm" onclick="deleteProf('${p.id}')" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>`;
    el.appendChild(card);
  });
}

function renderUesList() {
  const el = document.getElementById('ues-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.ues.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>Aucune UE enregistrée.</p></div>';
    return;
  }

  state.ues.forEach(u => {
    const card = document.createElement('div');
    card.className = 'card type-ue';
    card.innerHTML = `
      <div class="card-badge badge-ue">UE</div>
      <div class="card-title">${u.matiere}</div>
      <div class="card-meta">
        <span>${u.credit} crédits ECTS</span>
      </div>
      <div class="card-actions">
        <button class="btn-icon-sm" onclick="deleteUE('${u.id}')" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>`;
    el.appendChild(card);
  });
}

function renderCoursList() {
  const el = document.getElementById('cours-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.cours.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>Aucun cours planifié.</p></div>';
    return;
  }

  state.cours.forEach(c => {
    const d = new Date(c.heureDebut);
    const card = document.createElement('div');
    card.className = 'card type-cours';
    card.innerHTML = `
      <div class="card-badge badge-cours">Cours</div>
      <div class="card-title">${c.ue?.matiere || 'Matière inconnue'}</div>
      <div class="card-meta">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          ${c.prof?.prenom || ''} ${c.prof?.nom || 'Inconnu'}
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}
        </span>
      </div>
      <div class="card-actions">
        <button class="btn-icon-sm" onclick="deleteCours('${c.id}')" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>`;
    el.appendChild(card);
  });
}

function renderSeminairesList() {
  const el = document.getElementById('seminaires-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.seminaires.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>Aucun séminaire planifié.</p></div>';
    return;
  }

  state.seminaires.forEach(s => {
    const d = new Date(s.heureDebut);
    const card = document.createElement('div');
    card.className = 'card type-sem';
    card.innerHTML = `
      <div class="card-badge badge-sem">Séminaire</div>
      <div class="card-title">${s.titre || 'Séminaire Académique'}</div>
      <div class="card-meta">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          ${s.responsable?.prenom || ''} ${s.responsable?.nom || 'Inconnu'}
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}
        </span>
      </div>
      <div class="card-actions">
        <button class="btn-icon-sm" onclick="deleteSeminaire('${s.id}')" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>`;
    el.appendChild(card);
  });
}

// =========================================================================
// CALENDRIER  — classes CSS : .cal-header-time .cal-header-day .cal-time-cell .cal-day-cell .cal-event
// =========================================================================
let currentWeekStart = null;
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const HEURES_DEBUT = 8;
const HEURES_FIN   = 20;

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();              // 0=Dim … 6=Sam
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function goToToday() {
  currentWeekStart = getMonday(new Date());
  updateWeekLabel();
  renderCalendarEvents();
}

function prevWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  updateWeekLabel();
  renderCalendarEvents();
}

function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  updateWeekLabel();
  renderCalendarEvents();
}

function updateWeekLabel() {
  const label = document.getElementById('week-label');
  if (!label || !currentWeekStart) return;
  const fin = new Date(currentWeekStart);
  fin.setDate(fin.getDate() + 4);
  label.textContent = `Semaine du ${currentWeekStart.toLocaleDateString('fr-FR')} au ${fin.toLocaleDateString('fr-FR')}`;
}

// Construction initiale de la grille (une seule fois)
function buildCalendarGrid() {
  const grid = document.getElementById('calendar-grid');
  if (!grid || grid.dataset.built) return;
  grid.dataset.built = '1';

  // Ligne 1 : en-têtes (colonne heure + 5 jours)
  const timeHeader = document.createElement('div');
  timeHeader.className = 'cal-header-time';
  grid.appendChild(timeHeader);

  JOURS.forEach((jour, i) => {
    const h = document.createElement('div');
    h.className = 'cal-header-day';
    h.id = `cal-header-${i}`;
    h.innerHTML = `<div class="cal-day-name">${jour}</div><div class="cal-day-num" id="cal-daynum-${i}">-</div>`;
    grid.appendChild(h);
  });

  // Lignes heures
  for (let h = HEURES_DEBUT; h < HEURES_FIN; h++) {
    const timeCell = document.createElement('div');
    timeCell.className = 'cal-time-cell';
    timeCell.innerHTML = `<span class="cal-time-label">${h}:00</span>`;
    grid.appendChild(timeCell);

    JOURS.forEach((_, i) => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.dataset.hour = h;
      cell.dataset.col  = i;
      grid.appendChild(cell);
    });
  }
}

function renderCalendarEvents() {
  if (!currentWeekStart) return;
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  // Mise à jour des numéros de jours dans les en-têtes
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  JOURS.forEach((_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);

    const header = document.getElementById(`cal-header-${i}`);
    const numEl  = document.getElementById(`cal-daynum-${i}`);
    if (!header || !numEl) return;

    numEl.textContent = date.getDate();
    header.classList.toggle('today', date.getTime() === today.getTime());
  });

  // Nettoyer les anciens événements
  grid.querySelectorAll('.cal-event').forEach(e => e.remove());

  // Afficher Cours
  state.cours.forEach(c => placeEvent(grid, {
    heureDebut: c.heureDebut,
    heureFin:   c.heureFin,
    title:      c.ue?.matiere || 'Cours',
    sub:        `${c.prof?.prenom || ''} ${c.prof?.nom || ''}`,
    type:       'cours'
  }));

  // Afficher Séminaires
  state.seminaires.forEach(s => placeEvent(grid, {
    heureDebut: s.heureDebut,
    heureFin:   s.heureFin,
    title:      s.titre || 'Séminaire',
    sub:        s.responsable?.nom || '',
    type:       'seminaire'
  }));
}

function placeEvent(grid, { heureDebut, heureFin, title, sub, type }) {
  const start = new Date(heureDebut);
  const end   = new Date(heureFin);

  const dayOfWeek = start.getDay();   // 0=Dim, 1=Lun … 5=Ven, 6=Sam
  if (dayOfWeek === 0 || dayOfWeek === 6) return; // week-end ignoré proprement

  const colIndex = dayOfWeek - 1;     // Lundi=0 … Vendredi=4

  // Vérifier que l'événement est dans la semaine affichée
  const eventMonday = getMonday(start);
  if (eventMonday.getTime() !== currentWeekStart.getTime()) return;

  const startH = start.getHours() + start.getMinutes() / 60;
  const endH   = end.getHours()   + end.getMinutes()   / 60;

  if (startH < HEURES_DEBUT || endH > HEURES_FIN || endH <= startH) return;

  // Trouver la cellule de départ
  const startRow = Math.floor(startH) - HEURES_DEBUT;
  const cell = grid.querySelector(`[data-hour="${Math.floor(startH)}"][data-col="${colIndex}"]`);
  if (!cell) return;

  const totalRows   = HEURES_FIN - HEURES_DEBUT; // 12 cellules = 12h
  const cellHeight  = grid.offsetHeight / (totalRows + 1) || 60; // hauteur approx
  const topPct      = ((startH - Math.floor(startH)) * 100);
  const heightPct   = ((endH - startH) / 1) * 100;

  const ev = document.createElement('div');
  ev.className = `cal-event type-${type}`;
  ev.style.cssText = `
    position:absolute;
    top:${topPct}%;
    height:${heightPct}%;
    left:3px; right:3px;
  `;
  ev.innerHTML = `
    <div class="cal-event-title">${title}</div>
    <div class="cal-event-sub">${sub}</div>
  `;

  cell.style.position = 'relative';
  cell.appendChild(ev);
}

// =========================================================================
// SELECTS
// =========================================================================
function populateSelects() {
  const cfg = {
    'cours-ue':            { list: state.ues,   val: u => u.matiere, label: u => u.matiere },
    'cours-prof':          { list: state.profs, val: p => p.nom,     label: p => `${p.prenom} ${p.nom}` },
    'sem-responsable':     { list: state.profs, val: p => p.nom,     label: p => `${p.prenom} ${p.nom}` },
    'ev-cours-ue':         { list: state.ues,   val: u => u.matiere, label: u => u.matiere },
    'ev-cours-prof':       { list: state.profs, val: p => p.nom,     label: p => `${p.prenom} ${p.nom}` },
    'ev-sem-responsable':  { list: state.profs, val: p => p.nom,     label: p => `${p.prenom} ${p.nom}` },
  };

  for (const [id, { list, val, label }] of Object.entries(cfg)) {
    const sel = document.getElementById(id);
    if (!sel) continue;
    sel.innerHTML = '';
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value       = val(item);
      opt.textContent = label(item);
      sel.appendChild(opt);
    });
  }
}

// =========================================================================
// COMPTEURS
// =========================================================================
function updateCounts() {
  const map = {
    'profs-count':  `${state.profs.length} professeur(s) enregistré(s)`,
    'ues-count':    `${state.ues.length} UE enregistrée(s)`,
    'cours-count':  `${state.cours.length} cours enregistré(s)`,
    'sem-count':    `${state.seminaires.length} séminaire(s) enregistré(s)`,
  };
  for (const [id, text] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}

// =========================================================================
// NAVIGATION VUES
// =========================================================================
function showView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const view    = document.getElementById(`view-${viewName}`);
  const navItem = document.querySelector(`[data-view="${viewName}"]`);
  if (view)    view.classList.add('active');
  if (navItem) navItem.classList.add('active');
}

// =========================================================================
// MODALES  — le CSS utilise display:none / display:block (pas de classe .open)
// =========================================================================
let currentEventType = 'cours';

function openModal(type) {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  document.getElementById('modal-overlay').style.display = 'block';

  const modal = document.getElementById(`modal-${type}`);
  if (modal) modal.style.display = 'block';

  if (type === 'event') {
    selectEventType('cours', document.querySelector('#modal-event .tab-btn'));
  }

  populateSelects();
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  document.getElementById('modal-overlay').style.display = 'none';
}

function selectEventType(type, btn) {
  currentEventType = type;
  document.querySelectorAll('#modal-event .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('event-cours-form').style.display     = type === 'cours'     ? 'block' : 'none';
  document.getElementById('event-seminaire-form').style.display = type === 'seminaire' ? 'block' : 'none';
}

// =========================================================================
// TOAST
// =========================================================================
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}
