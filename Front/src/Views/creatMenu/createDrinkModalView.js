const createDrinkModalView = ({ drinks }) => `
  <div id="drink-modal" class="modal">
    <div class="modal-content">
      <h3>Choisissez les boissons</h3>
      <ul class="drink-list">
        ${drinks.map((drink) => `
          <li>
            <input type="checkbox" id="drink_${drink.id}" value="${drink.id}" />
            <label for="drink_${drink.id}">${drink.name}</label>
            <input 
              type="number" 
              class="quantity-input" 
              id="quantity_drink_${drink.id}" 
              placeholder="Quantité" 
              min="1" 
              value="1" 
            />
          </li>
        `).join('')}
      </ul>
      <button id="validate-drinks">Valider</button>
      <button class="close-modal">Fermer</button>
    </div>
  </div>
`;
export default createDrinkModalView;
