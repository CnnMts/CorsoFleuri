const createAppetizerModalView = ({ appetizers }) => `
  <div id="appetizer-modal" class="modal">
    <div class="modal-content">
      <h3>Choisissez les entrées</h3>
      <ul class="appetizer-list">
        ${appetizers.map((app) => `
          <li>
            <input type="checkbox" id="appetizer_${app.id}" value="${app.id}" />
            <label for="appetizer_${app.id}">${app.name}</label>
          </li>
        `).join('')}
      </ul>
      <button id="validate-appetizers">Valider</button>
      <button id="close-modal">Fermer</button>
    </div>
  </div>
`;

export default createAppetizerModalView;
