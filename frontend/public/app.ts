document.getElementById('login-button')?.addEventListener('click', () => {
  // Obtener la URL de autorización desde el backend
  fetch('http://127.0.0.1:3000/api/auth-url')
    .then(response => response.json())
    .then(data => {
      window.location.href = data.url;  // Redirigir al usuario a la página de autorización
    })
    .catch(error => {
      console.error('Error al obtener la URL de autorización:', error);
      alert('Hubo un error al obtener el enlace de autorización.');
    });
});

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  
  if (authCode) {
    // Enviar el código de autorización al backend para obtener el access token
    fetch('http://127.0.0.1:3000/api/auth', {  // Asegúrate de que la URL sea correcta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: authCode }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Si la autenticación fue exitosa, muestra la página de inicio
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
  }
};
