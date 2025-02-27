window.onload = () => {

  localStorage.removeItem("accessToken");

  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    document.getElementById('login-page')?.classList.add('hidden');
    document.getElementById('home-page')?.classList.remove('hidden');
  } else {
    document.getElementById('login-page')?.classList.remove('hidden');
    document.getElementById('home-page')?.classList.add('hidden');
  }

  // Mostrar la página de login si no hay token y hay un código de autorización
  if (authCode && !accessToken) {
    fetch('http://127.0.0.1:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: authCode }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.token?.access_token) {

          const accessToken = data.token.access_token;

          localStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('accessToken', accessToken);

          window.history.replaceState({}, document.title, window.location.pathname);

          // console.log('Token guardado:', accessToken);

          const loginPage = document.getElementById('login-page');
          const homePage = document.getElementById('home-page');

          if (loginPage) {
            loginPage.classList.add('hidden');
            loginPage.classList.remove('block');
            loginPage.style.display = 'none'; // Force with inline style
          }

          if (homePage) {
            homePage.classList.remove('hidden');
            homePage.classList.add('block');
            homePage.style.display = 'block'; // Force with inline style
          }
        } else {
          alert('Error al iniciar sesión');
        }
      })
      .catch(error => {
        console.error('Error de autenticación:', error);
        alert('Hubo un error durante la autenticación.');
      });
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {

      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      
      //console.log("accessToken después de eliminarlo:", localStorage.getItem("accessToken"));
      
      document.cookie = 'session=; Path=/; Max-Age=0';
      window.location.href = 'http://127.0.0.1:5500/frontend/index.html';
    });
  }
};

document.getElementById('login-button')?.addEventListener('click', () => {
  fetch('http://127.0.0.1:3000/api/auth-url')
    .then(response => response.json())
    .then(data => {
      const authUrl = `${data.url}&prompt=login`;
      window.location.href = authUrl;
    })
    .catch(error => {
      console.error('Error al obtener la URL de autorización:', error);
      alert('Hubo un error al obtener el enlace de autorización.');
    });
});
