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
      const menuId = 1; // Remplacez par l'ID du menu que vous souhaitez récupérer
      const menuDetails = await MenuModel.getMenuDetails(menuId);

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
            ${cashRegisterView(menuDetails)}
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
