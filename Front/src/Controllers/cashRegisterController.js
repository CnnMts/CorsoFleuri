import MenuModel from "../Models/menuModel.js";
import cashRegisterView from "../Views/cashRegisterView.js";

class CashRegisterController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.run();
  }

  async run() {
    try {
      const allMenus = await MenuModel.getAllMenus();
      this.render(allMenus);
    } catch (error) {
      this.handleError(error);
    }
  }

  render(allMenus) {
    const htmlResponse = this.generateHTMLResponse(allMenus);
    this.res.writeHead(200, { "Content-Type": "text/html" });
    this.res.end(htmlResponse);
  }

  generateHTMLResponse(allMenus) {
    return `
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
              ${this.addEventListeners()}
            });
  
            ${this.showModalScript()}
          </script>
        </body>
      </html>
    `;
  }
  
  showModalScript() {
    return `
      function showModal(name) {
        let listProductOfMenu = document.querySelector('.listProductOfMenu');
        if (!listProductOfMenu) {
          listProductOfMenu = document.createElement('div');
          listProductOfMenu.classList.add('listProductOfMenu');
          document.body.appendChild(listProductOfMenu);
        }
  
        const existingModal = listProductOfMenu.querySelector('.modal');
        if (existingModal) {
          listProductOfMenu.removeChild(existingModal);
        }
  
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = \`
          <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>\${name}</h2>
            <p>Vous avez ajouté le menu : \${name}</p>
          </div>
        \`;
  
        listProductOfMenu.appendChild(modal);
  
        modal.querySelector('.close-button').addEventListener('click', () => {
          const modalToRemove = listProductOfMenu.querySelector('.modal');
          if (modalToRemove) {
            listProductOfMenu.removeChild(modalToRemove);
          }
        });
      }
    `;
  }
  

  addEventListeners() {
    return `
      document.querySelectorAll('.addMenuButton').forEach(button => {
        button.addEventListener('click', () => {
          const menuName = button.getAttribute('data-name');
          if (!menuName) {
            console.error("Nom du menu manquant ou invalide !");
            return;
          }

          console.log('Bouton cliqué pour le menu :', menuName);
          showModal(menuName);
        });
      });
    `;
  }


  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
    this.res.writeHead(500, { "Content-Type": "text/plain" });
    this.res.end('Erreur serveur : Impossible de récupérer les données.');
  }
}

export default CashRegisterController;
