import { updateAppState, getAppState } from './appStateModel.js';

class LoginModel {
  static async connexion(name, password) {
    fetch('http://localhost:8083/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: name,
        identification_code: password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          console.log('Connexion réussie, token reçu:', data.token);
          localStorage.setItem('token', data.token);

          updateAppState({
            loggedIn: true,
            user: data.username,
            role_id: data.role_id
          });

          console.log('User : ', getAppState());

          alert('Authentication Successful');
          // Rediriger ou mettre à jour l'interface de l'application
          window.location.href = '/test';
        } else {
          console.error('Erreur lors de l\'authentification:', data.error);
          alert('Authentication Failed');
        }
      })
      .catch((error) => {
        console.error('Erreur réseau:', error);
      });

    //   try {
    //     const response = await fetch('http://localhost:8083/auth/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json; charset=UTF-8'
    //       },
    //       body: JSON.stringify({
    //         username: name, // Ne pas utiliser de `${}`
    //         identification_code: password
    //       })
    //     });

    //     if (!response.ok) {
    //       throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    //     }

    //     console.log(response);
    //     return await response.json(); // Retourne la réponse JSON
    //   } catch (error) {
    //     console.error('Erreur de connexion:', error);
    //     return null;
    //   }
  }
}

export default LoginModel;
