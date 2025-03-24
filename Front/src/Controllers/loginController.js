import LoginView from "../Views/loginView.js";
import LoginModel from "../Models/loginModel.js"

class LoginController {
  constructor(req, res) {
    this.el = document.querySelector('#app');
    this.req = req;
    this.res = res;
    this.run();
  }

  run() {
    try {
      this.render();
    } catch (error) {
      this.handleError(error);
    }
  }

  render() {
    this.el.innerHTML = LoginView();
    this.getLogin();
  }

  getLogin() {
    document.querySelector('#login-btn').addEventListener("click", async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const password = document.getElementById("password").value;
      LoginModel.connexion(name,password);
    });
  }

  generateHTMLResponse() {
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
          ${LoginView()}
          <script>
            document.addEventListener('DOMContentLoaded', () => {
                ${this.getLogin().toString()}
            });
          </script>
        </body>
      </html>
    `;
  }

  handleError(error) {
    console.error('Erreur dans le contrôleur :', error);
    // this.res.writeHead(500, { "Content-Type": "text/plain" });
    // this.res.end('Erreur serveur : Impossible de récupérer les données.');
  }
}

export default LoginController;
