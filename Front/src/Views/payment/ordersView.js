import orderMenusView from "./orderMenusView.js";
import menuChoicesView from "./menuChoicesView.js";

const ordersView = ({ id, status_id, total_price, discount_id, menusNames, products }) => {
    return `
      <div class="containerOrders">
        <div class="Order">
          <h2>Commande Numéro : ${id}</h2>
          <div class="Menus">
            ${menusNames.map((menuObj) => orderMenusView(menuObj)).join('')}
          </div>

          <div class="Products">
            ${products.map((prod) => menuChoicesView(prod)).join('')}
          </div>

          <h2>${parseFloat(total_price).toFixed(2)}€</h2>

          <button class="toggle-status-btn" data-order-id="${id}">${status_id == 1 ? 'À Payer' : 'Payée'}</button>
          <button class="delete-order-btn" data-order-id="${id}">Supprimer la commande</button>
          
          <!-- Définition de la remise via un select -->
          <div class="DiscountStatus">
            <label for="discount-${id}">Remise :</label>
            <select id="discount-${id}" class="discount-select" data-discount-order-id="${id}">
              <option value="1" ${discount_id == 1 ? 'selected' : ''}>Pas de remise</option>
              <option value="2" ${discount_id == 2 ? 'selected' : ''}>Partenaires</option>
              <option value="3" ${discount_id == 3 ? 'selected' : ''}>VIP</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
  
  export default ordersView;