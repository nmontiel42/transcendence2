window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  const accessToken = localStorage.getItem('accessToken');
  if (authCode && !accessToken) { // Solo intercambia el código si no hay un token ya almacenado
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
        window.history.replaceState({}, document.title, window.location.pathname); // Limpiar la URL
        console.log('Token guardado:', accessToken);
        document.getElementById('login-page')!.style.display = 'none';
        document.getElementById('home-page')!.style.display = 'block';
      } else {
        alert('Error al iniciar sesión');
      }
    })
    .catch(error => {
      console.error('Error de autenticación:', error);
      alert('Hubo un error durante la autenticación.');
    });
  } else if (accessToken) { // Si ya hay un token, mostrar directamente el contenido
    console.log('Sesión ya iniciada con token:', accessToken);
    document.getElementById('login-page')!.style.display = 'none';
    document.getElementById('home-page')!.style.display = 'block';
  }

  const logoutButton = document.getElementById('logout-button'); 
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      
      localStorage.removeItem("accessToken");
      console.log("accessToken despues de eliminarlo: ", localStorage.getItem("accessToken"));
      sessionStorage.removeItem("accessToken");
      document.cookie = 'session=; Path=/; Max-Age=0';
      //window.location.href='http://127.0.0.1:5500/frontend/public/index.html';
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

/* document.getElementById('logout-button')?.addEventListener('click', () => {

  // Limpiar localStorage y sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Eliminar cookies correctamente
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });

  // Limpiar parámetros en la URL
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  window.history.replaceState({}, '', url);

  // Mostrar pantalla de login y ocultar home
  document.getElementById('login-page')!.style.display = 'block';
  document.getElementById('home-page')!.style.display = 'none';

  // (Opcional) Recargar la página para asegurar limpieza total
   window.location.reload();
}); */

