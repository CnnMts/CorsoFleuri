import MenuModel from "../Models/menuModel.js";
import cashRegisterView from "../Views/cashRegisterView.js";

class CashRegisterController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.initialize();
  }

  async initialize() {
    try {
      // Récupérer les détails de tous les menus
      const allMenus = await MenuModel.getAllMenus();

      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cash Register</title>
            <link rel="stylesheet" href="./Styles/cash_register.css">
          </head>
          <body>
            ${cashRegisterView(allMenus)}
            <script>
              document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('.addMenuButton').forEach(button => {
                  button.addEventListener('click', () => {
                    const menuName = button.getAttribute('data-name');
                    console.log('Bouton cliqué pour le menu :', menuName); // Ajout du console.log
                    showModal(menuName);
                  });
                });
              });

              function showModal(name) {
                const modal = document.createElement('div');
                modal.classList.add('modal');
                modal.innerHTML = \`
                  <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>\${name}</h2>
                    <p>Vous avez ajouté le menu : \${name}</p>
                  </div>
                \`;
                document.body.appendChild(modal);

                modal.querySelector('.close-button').addEventListener('click', () => {
                  document.body.removeChild(modal);
                });
              }
            </script>
          </body>
        </html>
      `;

      this.res.writeHead(200, { "Content-Type": "text/html" });
      this.res.end(htmlResponse);
    } catch (error) {
      console.error('Erreur dans le contrôleur :', error);
      this.res.writeHead(500, { "Content-Type": "text/plain" });
      this.res.end('Erreur serveur : Impossible de récupérer les données.');
    }
  }
}

export default CashRegisterController;
