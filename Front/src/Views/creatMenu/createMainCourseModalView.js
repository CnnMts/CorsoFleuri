const createMainCourseModalView = ({ mainCourses }) => `
  <div id="main-course-modal" class="menu-modal">
    <div class="modal-content color-bg-white border-black font-carlito font-size-16">
      <h3 class="font-barlow font-size-32">Choisissez les plats principaux</h3>
      <ul class="main-course-list">
        ${mainCourses.map((course) => `
          <li>
            <input type="checkbox" id="main_${course.id}" value="${course.id}" />
            <label for="main_${course.id}">${course.name}</label>
          </li>
        `).join('')}
      </ul>
      <button id="validate-main-courses" class="border-black color-bg-warning color-white font-size-32 font-barlow">Valider</button>
        <button class="close-modal border-black color-bg-negative color-white font-size-32 font-barlow">Fermer</button>
    </div>
  </div>
`;

export default createMainCourseModalView;
