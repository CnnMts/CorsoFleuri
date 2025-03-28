import '../Styles/navTicket.css';

const navTicketView = () => `
    <div class="containerRight">
      <div class="containerTicket">
       <h2 id="tiltle-container-ticket" class="font-barlow font-size-32">COMMANDES EN COURS</h2>
          <div id="tickets-container">
          </div>
          <div class="OrderPriceContent"> </div> 
      </div>

      <div class="bottom-navTicket">
        <div class="totalPrice color-bg-secondary color-white">
          <h2 class="font-barlow font-size-32">Total : <span id="global-total" class="font-barlow font-size-32">0</span> €</h2>
        </div>
        <div class="containerPaymentButton">
          <button type="button" class="payment-button font-barlow border-black color-bg-negative color-white font-size-32">Encaisser</button>
        </div> 
      </div>
    </div>
  `;

export default navTicketView;
