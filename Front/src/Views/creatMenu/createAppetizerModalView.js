const createAppetizerModalView = ({ appetizers }) => `
  <div id="appetizer-modal" class="menu-modal" style="display: flex;">
    <div class="modal-content">
      <h3>Choisissez les entrées</h3>
      <ul class="appetizer-list">
        ${appetizers.map((app) => `
          <li>
            <input type="checkbox" id="appetizer_${app.id}" value="${app.id}" />
            <label for="appetizer_${app.id}">${app.name}</label>
            <input 
              type="number" 
              class="quantity-input" 
              id="quantity_appetizer_${app.id}" 
              placeholder="Quantité" 
              min="1" 
              value="1" 
            />
          </li>
        `).join('')}
      </ul>
      <button id="validate-appetizers">Valider</button>
      <button class="close-modal">Fermer</button>
    </div>
  </div>
`;
export default createAppetizerModalView;
