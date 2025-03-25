import navTopView from './navTopView.js';
import menusView from './menusView.js';
import navTicketView from './navTicketView.js';
import logoutButtonView from './logoutButtonView.js';

const CashRegister = ({ menus, ticket }) => `
  ${navTopView()}
  <div class="container">
    <div class="containerMiddle">
      <div class="listProductOfMenu">
        ${menus.map((menu) => menusView(menu)).join('')}
      </div>
    </div>
    <div id="ticket-container">
      ${navTicketView(ticket)}
    </div>
  </div>
  <div>
    ${logoutButtonView()}
  </div>
`;

export default ({ menus, ticket = { name: 'Ticket', price: 0, products: [] } }) => {
  if (!menus || menus.length === 0) {
    return '<div>Aucune donnée disponible</div>';
  }

  return `
    <div class="Cash_register">
      ${CashRegister({ menus, ticket })}
    </div>
  `;
};
