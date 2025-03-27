import navTopView from './navTopView.js';
import menusView from './menusView.js';
import navTicketView from './navTicketView.js';

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
    <button id="testButton">Imprimer</button>
  </div>
`;

export default ({ menus, ticket = { name: 'Ticket', price: 0, products: [] }, onPrintTicket }) => {
  if (!menus || menus.length === 0) {
    return '<div>Aucune donnée disponible</div>';
  }

  // Attacher le gestionnaire d'événements ici après le rendu de la vue
  setTimeout(() => {
    const printButton = document.getElementById('testButton');
    if (printButton) {
      // Utiliser addEventListener pour ajouter l'événement de clic de manière plus propre
      printButton.addEventListener('click', () => onPrintTicket(ticket));
    }
  }, 0);

  return `
    <div class="Cash_register">
      ${CashRegister({ menus, ticket, onPrintTicket })}
    </div>
  `;
};
