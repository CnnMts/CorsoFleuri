import navTopView from '../navTopView.js';
import ordersView from './ordersView.js';
import logoutButtonView from '../logoutButtonView.js';

// Définissez une fonction "paymentTemplate" qui prend un objet avec "orders"
export function paymentTemplate({ orders }) {
  return `
    ${navTopView()}
    <div class="container">
      <div class="containerMiddle">
        <div class="listOfOrders">
          ${orders.map((order) => ordersView(order)).join('')}
        </div>
      </div>
    </div>
    <div>
      ${logoutButtonView()}
    </div>
  `;
}

// Exportez la vue principale en acceptant "orders" comme argument
export default function PaymentView({ orders }) {
  if (!orders || orders.length === 0) {
    return '<div>Aucune donnée disponible</div>';
  }
  return `
    <div class="Payment">
      ${paymentTemplate({ orders })}
    </div>
  `;
}
