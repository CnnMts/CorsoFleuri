import createMenuHeaderView from './createMenuHeaderView.js';
import createMenuFormView from './createMenuFormView.js';
import exitButtonView from '../exitButtonView.js';

import '../../Styles/createMenu.css';

const createMenuView = (data) => `
  ${exitButtonView()}
  <div class="menu-creation font-barlow">
    ${createMenuHeaderView()}
    ${createMenuFormView(data)}
  </div>
`;

export default createMenuView;
