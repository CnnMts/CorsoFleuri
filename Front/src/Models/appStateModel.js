const INITIAL_STATE = {
  loggedIn: false,
  user: null,
  role_id: null
};

// Exporter state en tant que constante (son contenu sera modifié via Object.assign)
export const state = { ...INITIAL_STATE };

// Définition de persistState avant son utilisation
export function persistState() {
  localStorage.setItem('appState', JSON.stringify(state));
}

// Mettre à jour l'état et sauvegarder ensuite
export function updateAppState(newState) {
  Object.assign(state, newState);
  persistState(); // Appel à persistState, maintenant déclarée au-dessus
  // Optionnel : déclencher un event ou notifier la vue pour qu'elle se mette à jour
}

// Renvoyer l'état courant
export function getAppState() {
  return state;
}

// Restaurer l'état lors du chargement de la page
export function loadState() {
  const saved = localStorage.getItem('appState');
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
  return state;
}

// Effacer l'état (logout par exemple)
export function clearAppState() {
  Object.assign(state, INITIAL_STATE);
  localStorage.removeItem('appState');
}

// Vous pouvez toujours exporter state par défaut si nécessaire
export default state;
