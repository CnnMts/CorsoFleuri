const navTopView = () => `
  <div class="containerTop">
    <div class="logo"><h2>Mon logo</h2></div>
    <button type="button" id="order" class="active" onclick="window.location.href='http://localhost:8085/test';">COMMANDE</button>
    <button type="button" id="payment" class="active" onclick="window.location.href='http://localhost:8085/payment';">A PAYER</button>
    <button type="button" id="gestion" class="active" onclick="window.location.href='http://localhost:8085/gestion';">GESTION</button>
  </div>
`;

export default navTopView;
