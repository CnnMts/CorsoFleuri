const INITIAL_STATE = {
    loggedIn: false,
    user: null,
    user_id: null,
    role_id: null
};

let state = { ...INITIAL_STATE };
    
export function updateAppState(newState) {
    Object.assign(state, newState);
    persistState(); // Après chaque modification, sauvegarde automatique
    // Optionnel : déclencher un event ou notifier la vue pour qu'elle se mette à jour
}

export function getAppState() {
    return state;
}

// Sauvegarder l'état dans le localStorage
export function persistState() {
    localStorage.setItem('appState', JSON.stringify(state));
}

// Restaurer l'état lors du chargement de la page
export function loadState() {
    const saved = localStorage.getItem('appState');
    if (saved) {
        state = JSON.parse(saved);
    }
    return state;
}

// Optionnel : fonction pour effacer l'état (logout par ex.)
export function clearAppState() {
    state = { ...INITIAL_STATE };
    localStorage.removeItem('appState');
}

export default state;
  