import createMenuHeaderView from './createMenuHeaderView.js';
import createMenuFormView from './createMenuFormView.js';
import exitButtonView from '../exitButtonView.js';

const createMenuView = (data) => `
  ${exitButtonView()}
  <div class="menu-creation">
    ${createMenuHeaderView()}
    ${createMenuFormView(data)}
  </div>
`;

export default createMenuView;
