const Login = () => `
        <form action="" method="POST" class="login-form">
          <div class="form-example">
            <label for="name">Enter your name: </label>
            <input type="text" name="name" id="name" required />
          </div>
          <div>
            <label for="password">Enter your password: </label>
            <input type="password" name="password" id="password" required />
          </div>
          <div>
            <button id="login-btn" type="button">yes</button>
          </div>
        </form>
  `;

export default Login;
