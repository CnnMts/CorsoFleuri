import { updateAppState } from '../Models/appStateModel.js';
import { getAppState } from '../Models/appStateModel.js';

class LogoutModel {
    static async deconnexion() {
        fetch('http://localhost:8083/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                updateAppState({ 
                    loggedIn: false, 
                    user: null,
                    role_id: null
                });

                console.log('User : ', getAppState());

                alert('Disconnection Successful');
                // Rediriger ou mettre à jour l'interface de l'application
                window.location.href = "/login";
              } else {
                console.error('Erreur lors de la déconnexion :', data.error);
                alert('Disconnection Failed');
              }
            })
            .catch(error => {
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
  
export default LogoutModel;
