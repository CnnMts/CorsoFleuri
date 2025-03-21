import createMenuHeaderView from './createMenuHeaderView.js';
import createMenuFormView from './createMenuFormView.js';
import exitButtonView from '../exitButtonView.js';

const createMenuView = () => `

${exitButtonView()}
<div class="menu-creation">
    ${createMenuHeaderView()}
    ${createMenuFormView()}
  </div>
`;

export default createMenuView;
