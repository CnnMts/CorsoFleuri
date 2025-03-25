import CorsoFleuriLogo from '../Assets/CorsoLogo.png';
import { getAppState } from '../Models/appStateModel.js';

const navTopView = () => `
  <div class="containerTop">
    <div class="logo"><img src="${CorsoFleuriLogo}" alt="Logo Corso_FLeuri"></div>
    <button type="button" id="order" class="active" onclick="window.location.href='http://localhost:8085/test';">COMMANDE</button>
    <button type="button" id="payment" class="active" onclick="window.location.href='http://localhost:8085/payment';">A PAYER</button>
    ${getAppState().role_id == 1 
      ? 
      '<button type="button" id="gestion" class="active" onclick="window.location.href=`http://localhost:8085/gestion`;">GESTION</button>' 
      : 
      '<button type="button" id="gestion" class="active" onclick="alert(`Permissions Insuffisantes`)";">GESTION</button>'
    }
  </div>
`;

export default navTopView;
