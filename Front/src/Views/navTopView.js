import CorsoFleuriLogo from '../Assets/CorsoLogo.png';

const navTopView = () => `
  <div class="containerTop">
    <div class="logo"><img src="${CorsoFleuriLogo}" alt="Logo Corso_FLeuri"></div>
    <button type="button" id="order" class="active" onclick="window.location.href='http://localhost:8085/test';">COMMANDE</button>
    <button type="button" id="payment" class="active" onclick="window.location.href='http://localhost:8085/payment';">A PAYER</button>
    <button type="button" id="gestion" class="active" onclick="window.location.href='http://localhost:8085/gestion';">GESTION</button>
  </div>
`;

export default navTopView;
