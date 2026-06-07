// =========================================================================
// CONFIGURATION DE L'API JAVA
// =========================================================================
const API_URL = "http://localhost:8080/api";

// L'état de l'application est maintenant synchronisé avec le serveur Java
const state = {
  profs: [],
  ues: [],
  cours: [],
  seminaires: []
};

// Variable globale pour suivre l'onglet actif dans la modale ('cours' ou 'seminaire')
let currentEventType = 'cours';

// =========================================================================
// CHARGEMENT SYNCHRONISÉ DEPUIS JAVA (FETCH)
// =========================================================================
async function loadDataFromJava() {
  try {
    // Appel simultané des 4 points d'accès Java
    const [resProfs, resUes, resCours, resSeminaires] = await Promise.all([
      fetch(`${API_URL}/profs`),
      fetch(`${API_URL}/ues`),
      fetch(`${API_URL}/cours`),
      fetch(`${API_URL}/seminaires`)
    ]);

    // On stocke les données JSON renvoyées par le serveur Java
    state.profs = await resProfs.json();
    state.ues = await resUes.json();
    state.cours = await resCours.json();
    state.seminaires = await resSeminaires.json();

    // Rafraîchissement de l'interface graphique
    renderProfsList();
    renderUesList();
    renderCoursList();
    renderSeminairesList();
    renderCalendar();
    populateSelects(); 
  } catch (err) {
    console.error("Erreur de synchronisation avec Java :", err);
    toast("Erreur : Impossible de se connecter au serveur Java ❌");
  }
}

// Lancer le chargement dès que la page HTML est prête
document.addEventListener("DOMContentLoaded", loadDataFromJava);

// =========================================================================
// ACTIONS D'AJOUT (ENVOI VERS JAVA VIA POST)
// =========================================================================

async function addProf() {
  const nom = document.getElementById('prof-nom').value.trim();
  const prenom = document.getElementById('prof-prenom').value.trim();
  const age = parseInt(document.getElementById('prof-age').value);
  const genre = document.getElementById('prof-genre').value;

  if (!nom || !prenom || isNaN(age)) {
    toast('Veuillez remplir tous les champs du professeur');
    return;
  }

  const nouveauProf = { nom, prenom, age, genre };

  try {
    const response = await fetch(`${API_URL}/profs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouveauProf)
    });

    if (response.ok) {
      toast('Professeur enregistré en Java ✓');
      document.getElementById('prof-nom').value = '';
      document.getElementById('prof-prenom').value = '';
      document.getElementById('prof-age').value = '';
      await loadDataFromJava(); // Recharge et rafraîchit l'écran
    }
  } catch (err) {
    toast('Erreur de sauvegarde côté serveur ❌');
  }
}

async function addUE() {
  const matiere = document.getElementById('ue-matiere').value.trim();
  const credit = parseInt(document.getElementById('ue-credit').value);

  if (!matiere || isNaN(credit)) {
    toast('Veuillez remplir tous les champs de l\'UE');
    return;
  }

  const nouvelleUe = { matiere, credit };

  try {
    const response = await fetch(`${API_URL}/ues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouvelleUe)
    });

    if (response.ok) {
      toast('UE enregistrée en Java ✓');
      document.getElementById('ue-matiere').value = '';
      document.getElementById('ue-credit').value = '';
      await loadDataFromJava();
    }
  } catch (err) {
    toast('Erreur de sauvegarde côté serveur ❌');
  }
}

async function saveEvent() {
  const type = currentEventType;

  if (type === 'cours') {
    const debut = document.getElementById('ev-cours-debut').value;
    const fin = document.getElementById('ev-cours-fin').value;
    const ueMatiere = document.getElementById('ev-cours-ue').value;
    const profNom = document.getElementById('ev-cours-prof').value;

    if (!debut || !fin || !ueMatiere || !profNom) {
      toast('Veuillez remplir tous les champs du cours');
      return;
    }

    const ueAssociee = state.ues.find(u => u.matiere === ueMatiere);
    const profAssocie = state.profs.find(p => p.nom === profNom);

    const nouveauCours = {
      heureDebut: debut, // Format "YYYY-MM-DDTHH:MM:SS" matchant le LocalDateTime Java
      heureFin: fin,
      ue: ueAssociee,
      prof: profAssocie
    };

    try {
      const response = await fetch(`${API_URL}/cours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouveauCours)
      });

      if (response.ok) {
        toast('Cours ajouté au planning Java ✓');
        closeModal();
        await loadDataFromJava();
      }
    } catch (err) {
      toast('Erreur lors de l\'enregistrement du cours ❌');
    }

  } else if (type === 'seminaire') {
    const debut = document.getElementById('ev-sem-debut').value;
    const fin = document.getElementById('ev-sem-fin').value;
    const respNom = document.getElementById('ev-sem-responsable').value;
    const titre = document.getElementById('ev-sem-titre').value.trim();

    if (!debut || !fin || !respNom || !titre) {
      toast('Veuillez remplir tous les champs du séminaire');
      return;
    }

    const responsableAssocie = state.profs.find(p => p.nom === respNom);

    const nouveauSeminaire = {
      heureDebut: debut,
      heureFin: fin,
      responsable: responsableAssocie
    };

    try {
      const response = await fetch(`${API_URL}/seminaires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouveauSeminaire)
      });

      if (response.ok) {
        toast('Séminaire ajouté au planning Java ✓');
        closeModal();
        await loadDataFromJava();
      }
    } catch (err) {
      toast('Erreur lors de l\'enregistrement du séminaire ❌');
    }
  }
}

// =========================================================================
// ACTIONS DE SUPPRESSION (DELETE EN JAVA OU NETTOYAGE LOCAL)
// =========================================================================
async function deleteCours(id) {
  try {
    const response = await fetch(`${API_URL}/cours/${id}`, { method: 'DELETE' });
    if (response.ok) {
      toast('Cours supprimé ✓');
      await loadDataFromJava();
    }
  } catch (err) {
    state.cours = state.cours.filter(c => c.id !== id);
    renderCoursList(); renderCalendar();
  }
}

async function deleteSeminaire(id) {
  try {
    const response = await fetch(`${API_URL}/seminaires/${id}`, { method: 'DELETE' });
    if (response.ok) {
      toast('Séminaire supprimé ✓');
      await loadDataFromJava();
    }
  } catch (err) {
    state.seminaires = state.seminaires.filter(s => s.id !== id);
    renderSeminairesList(); renderCalendar();
  }
}

async function deleteProf(id) {
  try {
    await fetch(`${API_URL}/profs/${id}`, { method: 'DELETE' });
    await loadDataFromJava();
  } catch (err) {
    state.profs = state.profs.filter(p => p.id !== id);
    renderProfsList();
  }
}

async function deleteUE(id) {
  try {
    await fetch(`${API_URL}/ues/${id}`, { method: 'DELETE' });
    await loadDataFromJava();
  } catch (err) {
    state.ues = state.ues.filter(u => u.id !== id);
    renderUesList();
  }
}

// =========================================================================
// FONCTIONS D'AFFICHAGE DU VISUEL EN DOCUMENT.CREATEELEMENT
// =========================================================================

function renderProfsList() {
  const el = document.getElementById('profs-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.profs.length === 0) {
    const pEmpty = document.createElement('p');
    pEmpty.className = 'empty-state';
    pEmpty.textContent = 'Aucun professeur enregistré.';
    el.appendChild(pEmpty);
    return;
  }

  state.profs.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';

    const infoDiv = document.createElement('div');
    const nameStrong = document.createElement('strong');
    nameStrong.textContent = `${p.prenom} ${p.nom}`;
    
    const detailsDiv = document.createElement('div');
    detailsDiv.style.cssText = 'font-size:0.75rem; color:var(--gray-500); margin-top:2px;';
    detailsDiv.textContent = `${p.age} ans • ${p.genre}`;

    infoDiv.appendChild(nameStrong);
    infoDiv.appendChild(detailsDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => deleteProf(p.id || idx);

    card.appendChild(infoDiv);
    card.appendChild(deleteBtn);
    el.appendChild(card);
  });
}

function renderUesList() {
  const el = document.getElementById('ues-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.ues.length === 0) {
    const pEmpty = document.createElement('p');
    pEmpty.className = 'empty-state';
    pEmpty.textContent = 'Aucune UE enregistrée.';
    el.appendChild(pEmpty);
    return;
  }

  state.ues.forEach((u, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';

    const infoDiv = document.createElement('div');
    const subjectStrong = document.createElement('strong');
    subjectStrong.textContent = u.matiere;

    const creditsDiv = document.createElement('div');
    creditsDiv.style.cssText = 'font-size:0.75rem; color:var(--gray-500); margin-top:2px;';
    creditsDiv.textContent = `${u.credit} Crédits ECTS`;

    infoDiv.appendChild(subjectStrong);
    infoDiv.appendChild(creditsDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => deleteUE(u.id || idx);

    card.appendChild(infoDiv);
    card.appendChild(deleteBtn);
    el.appendChild(card);
  });
}

function renderCoursList() {
  const el = document.getElementById('cours-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.cours.length === 0) {
    const pEmpty = document.createElement('p');
    pEmpty.className = 'empty-state';
    pEmpty.textContent = 'Aucun cours planifié.';
    el.appendChild(pEmpty);
    return;
  }

  state.cours.forEach((c, idx) => {
    const d = new Date(c.heureDebut);
    
    const card = document.createElement('div');
    card.className = 'item-card event-cours-item';

    const infoDiv = document.createElement('div');
    const titleStrong = document.createElement('strong');
    titleStrong.textContent = c.ue?.matiere || 'Matière inconnue';

    const profDiv = document.createElement('div');
    profDiv.style.cssText = 'font-size:0.75rem; color:var(--gray-500); margin-top:2px;';
    profDiv.textContent = `Par: ${c.prof?.prenom || ''} ${c.prof?.nom || 'Inconnu'}`;

    const timeDiv = document.createElement('div');
    timeDiv.style.cssText = 'font-size:0.75rem; color:var(--sky-dark); font-weight:500; margin-top:2px;';
    timeDiv.textContent = `Le ${d.toLocaleDateString()} à ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    infoDiv.appendChild(titleStrong);
    infoDiv.appendChild(profDiv);
    infoDiv.appendChild(timeDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => deleteCours(c.id || idx);

    card.appendChild(infoDiv);
    card.appendChild(deleteBtn);
    el.appendChild(card);
  });
}

function renderSeminairesList() {
  const el = document.getElementById('seminaires-list');
  if (!el) return;
  el.innerHTML = '';

  if (state.seminaires.length === 0) {
    const pEmpty = document.createElement('p');
    pEmpty.className = 'empty-state';
    pEmpty.textContent = 'Aucun séminaire planifié.';
    el.appendChild(pEmpty);
    return;
  }

  state.seminaires.forEach((s, idx) => {
    const d = new Date(s.heureDebut);

    const card = document.createElement('div');
    card.className = 'item-card event-sem-item';

    const infoDiv = document.createElement('div');
    const titleStrong = document.createElement('strong');
    titleStrong.textContent = 'Séminaire Académique';

    const respDiv = document.createElement('div');
    respDiv.style.cssText = 'font-size:0.75rem; color:var(--gray-500); margin-top:2px;';
    respDiv.textContent = `Responsable: ${s.responsable?.prenom || ''} ${s.responsable?.nom || 'Inconnu'}`;

    const timeDiv = document.createElement('div');
    timeDiv.style.cssText = 'font-size:0.75rem; color:var(--sky-dark); font-weight:500; margin-top:2px;';
    timeDiv.textContent = `Le ${d.toLocaleDateString()} à ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    infoDiv.appendChild(titleStrong);
    infoDiv.appendChild(respDiv);
    infoDiv.appendChild(timeDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => deleteSeminaire(s.id || idx);

    card.appendChild(infoDiv);
    card.appendChild(deleteBtn);
    el.appendChild(card);
  });
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  // On retire proprement les anciens éléments injectés sans toucher aux en-têtes fixes
  const elements = grid.querySelectorAll('.calendar-event');
  elements.forEach(e => e.remove());

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Affichage des Cours
  state.cours.forEach(c => {
    const start = new Date(c.heureDebut);
    const end = new Date(c.heureFin);
    const dayName = jours[start.getDay() - 1]; // Lundi = 1
    const dayIndex = jours.indexOf(dayName) + 1;

    if (dayIndex > 0) {
      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;
      
      const rowStart = Math.round((startHour - 8) * 2) + 2;
      const rowEnd = Math.round((endHour - 8) * 2) + 2;

      const evEl = document.createElement('div');
      evEl.className = 'calendar-event event-cours';
      evEl.style.gridColumn = dayIndex + 1;
      evEl.style.gridRow = `${rowStart} / ${rowEnd}`;

      const tDiv = document.createElement('div');
      tDiv.className = 'event-title';
      tDiv.textContent = c.ue?.matiere || 'Cours';

      const dDiv = document.createElement('div');
      dDiv.className = 'event-desc';
      dDiv.textContent = `${c.prof?.prenom || ''} ${c.prof?.nom || ''}`;

      const tmDiv = document.createElement('div');
      tmDiv.className = 'event-time';
      tmDiv.textContent = `${start.getHours()}:${String(start.getMinutes()).padStart(2,'0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2,'0')}`;

      evEl.appendChild(tDiv);
      evEl.appendChild(dDiv);
      evEl.appendChild(tmDiv);
      grid.appendChild(evEl);
    }
  });

  // Affichage des Séminaires
  state.seminaires.forEach(s => {
    const start = new Date(s.heureDebut);
    const end = new Date(s.heureFin);
    const dayName = jours[start.getDay() - 1];
    const dayIndex = jours.indexOf(dayName) + 1;

    if (dayIndex > 0) {
      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;
      
      const rowStart = Math.round((startHour - 8) * 2) + 2;
      const rowEnd = Math.round((endHour - 8) * 2) + 2;

      const evEl = document.createElement('div');
      evEl.className = 'calendar-event event-seminaire';
      evEl.style.gridColumn = dayIndex + 1;
      evEl.style.gridRow = `${rowStart} / ${rowEnd}`;

      const tDiv = document.createElement('div');
      tDiv.className = 'event-title';
      tDiv.textContent = 'Séminaire';

      const dDiv = document.createElement('div');
      dDiv.className = 'event-desc';
      dDiv.textContent = `Resp: ${s.responsable?.nom || 'Inconnu'}`;

      evEl.appendChild(tDiv);
      evEl.appendChild(dDiv);
      grid.appendChild(evEl);
    }
  });
}

function populateSelects() {
  const ueSelect = document.getElementById('ev-cours-ue');
  const profSelect = document.getElementById('ev-cours-prof');
  const respSelect = document.getElementById('ev-sem-responsable');

  if (ueSelect) {
    ueSelect.innerHTML = '';
    state.ues.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.matiere;
      opt.textContent = u.matiere;
      ueSelect.appendChild(opt);
    });
  }

  if (profSelect) {
    profSelect.innerHTML = '';
    state.profs.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.nom;
      opt.textContent = `${p.prenom} ${p.nom}`;
      profSelect.appendChild(opt);
    });
  }

  if (respSelect) {
    respSelect.innerHTML = '';
    state.profs.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.nom;
      opt.textContent = `${p.prenom} ${p.nom}`;
      respSelect.appendChild(opt);
    });
  }
}

// =========================================================================
// INTERACTION MODALES ET POPUPS
// =========================================================================
function openModal() {
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('event-modal').style.display = 'block';
  switchTab('cours');
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('event-modal').style.display = 'none';
}

function switchTab(type) {
  currentEventType = type;
  const btnCours = document.getElementById('tab-cours');
  const btnSem = document.getElementById('tab-seminaire');
  const formCours = document.getElementById('event-cours-form');
  const formSem = document.getElementById('event-seminaire-form');

  if (type === 'cours') {
    btnCours.classList.add('active');
    btnSem.classList.remove('active');
    formCours.style.display = 'block';
    formSem.style.display = 'none';
  } else {
    btnCours.classList.remove('active');
    btnSem.classList.add('active');
    formCours.style.display = 'none';
    formSem.style.display = 'block';
  }
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}