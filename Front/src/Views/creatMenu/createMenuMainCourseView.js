const createMenuMainCourseView = ({ mainCourses }) => `
  <div class="form-group">
    <label for="main-course">Plat</label>
    <select id="main-course" name="mainCourse">
      ${mainCourses.map((product) => `<option value="${product.id}">${product.name}</option>`).join('')}
    </select>
  </div>
`;

export default createMenuMainCourseView;
