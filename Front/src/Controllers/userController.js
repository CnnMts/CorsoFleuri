// userController.js
import registerView from '../Views/userGestion/registerView.js';

class UserController {
  constructor({ req, res }) {
    this.el = document.querySelector('#app'); // L'élément #app doit exister dans votre HTML
    this.req = req;
    this.res = res;
    this.init();
  }

  init() {
    this.render();
    this.bindEventListeners();
  }

  render() {
    this.el.innerHTML = registerView();
  }

  bindEventListeners() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (event) => this.handleRegister(event));
    } else {
      console.error("Formulaire d'inscription introuvable !");
    }
  }

  async handleRegister(event) {
    event.preventDefault();

    // Récupérer les valeurs du formulaire avec FormData
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const identification_code = formData.get('identification_code');

    if (!username || !identification_code) {
      alert('Tous les champs sont requis !');
      return;
    }

    // Ici, nous transformons identification_code en "password"
    const payload = { username, identification_code, role_id: 2 };

    try {
      const response = await fetch('http://localhost:8083/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Erreur : ${errorDetail}`);
      }

      const data = await response.json();
      console.log('Inscription réussie :', data);
      alert('Inscription réussie !');
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert(`Erreur lors de l'inscription : ${error.message}`);
    }
  }
}

export default UserController;
