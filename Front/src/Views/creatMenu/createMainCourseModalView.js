const createMainCourseModalView = ({ mainCourses }) => `
  <div id="main-course-modal" class="modal">
    <div class="modal-content">
      <h3>Choisissez les plats principaux</h3>
      <ul class="main-course-list">
        ${mainCourses.map((course) => `
          <li>
            <input type="checkbox" id="main_${course.id}" value="${course.id}" />
            <label for="main_${course.id}">${course.name}</label>
          </li>
        `).join('')}
      </ul>
      <button id="validate-main-courses">Valider</button>
        <button class="close-modal">Fermer</button>
    </div>
  </div>
`;

export default createMainCourseModalView;
