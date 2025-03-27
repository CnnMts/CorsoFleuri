import CorsoFleuriLogo from '../Assets/CorsoLogo.png';
import { getAppState } from '../Models/appStateModel.js';

import '../Styles/containerTop.css';

const navTopView = () => `
  <div class="containerTop">
    <div class="logo"><img src="${CorsoFleuriLogo}" alt="Logo Corso_FLeuri"></div>
    <button type="button" id="order" class="active font-barlow font-size-64 border-white color-bg-primary color-white" onclick="window.location.href='http://localhost:8085/test';">COMMANDE</button>
    <button type="button" id="payment" class="active font-barlow font-size-64 border-white color-bg-primary color-white" onclick="window.location.href='http://localhost:8085/payment';">A PAYER</button>
    ${getAppState().role_id == 1 
      ? 
      '<button type="button" id="gestion" class="active font-barlow font-size-64 border-white color-bg-primary color-white" onclick="window.location.href=`http://localhost:8085/gestion`;">GESTION</button>' 
      : 
      '<button type="button" id="gestion" class="active font-barlow font-size-64 border-white color-bg-negative color-white" onclick="alert(`Permissions Insuffisantes`)";">GESTION</button>'
    }
  </div>
`;

export default navTopView;
