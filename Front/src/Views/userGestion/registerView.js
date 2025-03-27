// registerView.js
const registerView = () => `
  <div class="register-container">
    <h2>Crée un Utilisateur </h2>
    <form id="register-form">
      <div>
        <label for="username">Nom d'utilisateur :</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="identification_code">Mot de passe :</label>
        <input type="text" id="identification_code" name="identification_code" required />
      </div>
      <button type="submit">S'inscrire</button>
      <button type="button" onclick="window.location.href='http://localhost:8085/gestion';">Quitter</button>
    </form>
  </div>
`;

export default registerView;
