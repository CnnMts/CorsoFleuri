import CorsoFleuriLogo from '../Assets/CorsoLogo.png';

import '../Styles/containerTop.css'

const navTopView = () => `
  <div class="containerTop">
    <div class="logo"><img src="${CorsoFleuriLogo}" alt="Logo Corso_FLeuri"></div>
    <button type="button" id="order" class="active font-barlow border-white" onclick="window.location.href='http://localhost:8085/test';">COMMANDE</button>
    <button type="button" id="payment" class="active font-barlow border-white" onclick="window.location.href='http://localhost:8085/payment';">A PAYER</button>
    <button type="button" id="gestion" class="active font-barlow border-white" onclick="window.location.href='http://localhost:8085/gestion';">GESTION</button>
  </div>
`;

export default navTopView;
