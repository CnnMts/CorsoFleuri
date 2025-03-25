import navTopView from '../navTopView.js';
import sidebarView from './sidebarView.js';
import menuListView from './menuListView.js';
import createMenuButtonView from './createMenuButtonView.js';

const mainView = (menus) => `
  ${navTopView()}
  <div class="page-content">
    ${sidebarView()}
    <main>
      ${menuListView(menus)}
      ${createMenuButtonView()}
    </main>
  </div>
`;
export default mainView;
