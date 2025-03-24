const navTicketView = () => `
    <div class="containerRight">
      <div class="containerTicket">
       <h2 id="tiltle-container-ticket">COMMANDE EN COURS</h2>
          <div id="tickets-container">
          </div>
          <div class="OrderPriceContent"> </div> 
      </div>

      <div class="bottom-navTicket">
        <div class="totalPrice">
              <!-- Vous pouvez ici afficher le total général, si besoin -->
              <h2>Total : <span id="global-total">0</span> €</h2>
            </div>
          <div class="containerPaymentButton">
            <button type="button" class="payment-button font-barlow border-black">Encaisser</button>
          </div> 
      </div>
    </div>
  `;

export default navTicketView;
