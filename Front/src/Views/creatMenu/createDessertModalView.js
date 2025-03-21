const createDessertModalView = ({ desserts }) => `
  <div id="dessert-modal" class="modal">
    <div class="modal-content">
      <h3>Choisissez les desserts</h3>
      <ul class="dessert-list">
        ${desserts.map((dessert) => `
          <li>
            <input type="checkbox" id="dessert_${dessert.id}" value="${dessert.id}" />
            <label for="dessert_${dessert.id}">${dessert.name}</label>
          </li>
        `).join('')}
      </ul>
      <button id="validate-desserts">Valider</button>
      <button id="close-dessert-modal">Fermer</button>
    </div>
  </div>
`;

export default createDessertModalView;
