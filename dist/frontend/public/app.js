"use strict";
var _a, _b;
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
            var _a;
            if (data.success && ((_a = data.token) === null || _a === void 0 ? void 0 : _a.access_token)) {
                const accessToken = data.token.access_token;
                localStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('accessToken', accessToken);
                // Limpiar el código de la URL
                window.history.replaceState({}, document.title, window.location.pathname);
                console.log('Token guardado:', accessToken);
                document.getElementById('login-page').style.display = 'none';
                document.getElementById('home-page').style.display = 'block';
            }
            else {
                alert('Error al iniciar sesión');
            }
        })
            .catch(error => {
            console.error('Error de autenticación:', error);
            alert('Hubo un error durante la autenticación.');
        });
    }
    else if (accessToken) { // Si ya hay un token, mostrar directamente el contenido
        console.log('Sesión ya iniciada con token:', accessToken);
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
    }
};
(_a = document.getElementById('login-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
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
(_b = document.getElementById('logout-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    // Limpiar cookies, localStorage y sessionStorage
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Limpiar parámetros en la URL
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url);
    // Mostrar pantalla de login
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('home-page').style.display = 'none';
});
