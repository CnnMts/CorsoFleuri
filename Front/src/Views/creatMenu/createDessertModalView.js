const createDessertModalView = ({ desserts }) => `
  <div id="dessert-modal" class="modal">
    <div class="modal-content">
      <h3>Choisissez les desserts</h3>
      <ul class="dessert-list">
        ${desserts.map((dessert) => `
          <li>
            <input type="checkbox" id="dessert_${dessert.id}" value="${dessert.id}" />
            <label for="dessert_${dessert.id}">${dessert.name}</label>
            <input 
              type="number" 
              class="quantity-input" 
              id="quantity_dessert_${dessert.id}" 
              placeholder="Quantité" 
              min="1" 
              value="1" 
            />
          </li>
        `).join('')}
      </ul>
      <button id="validate-desserts">Valider</button>
      <button class="close-modal">Fermer</button>
    </div>
  </div>
`;
export default createDessertModalView;
