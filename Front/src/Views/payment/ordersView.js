import orderMenusView from "./orderMenusView.js";
import menuChoicesView from "./menuChoicesView.js";

const ordersView = ({ id, status_id, total_price, menusNames, products }) => {
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
        </div>
      </div>
    `;
  }
  
  export default ordersView;
