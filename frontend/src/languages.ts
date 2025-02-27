/*------------ MENSAJES ------------*/

const languages = {
    es: {
        welcome: 'Bienvenido al <br>mundo arcade',
        signInPrompt: 'INICIA SESION PARA JUGAR',
        startButton: 'PULSA EMPEZAR',

        /* ----------------------- */

        homeWelcome: 'Bienvenido a la pagina de inicio',
        logoutButton: 'Cerrar sesión',
    },
    en: {
        welcome: 'Welcome to the <br>arcade world',
        signInPrompt: 'SIGN IN TO PLAY',
        startButton: 'PRESS START',

        /* ----------------------- */

        homeWelcome: 'Welcome to the home page',
        logoutButton: 'Log out',
    },
    fr: {
        welcome: 'Bienvenue dans le <br>monde arcade',
        signInPrompt: 'CONNEXION POUR JOUER',
        startButton: 'APPUIE SUR DEMARRER',

        /* ----------------------- */

        homeWelcome: 'Bienvenue sur la page d\'accueil',
        logoutButton: 'Se déconnecter',
    }
};

/*------------ CAMBIO DE IDIOMA ------------*/

function changeLanguage(lang: "es" | "en" | "fr") {
    localStorage.setItem("selectedLanguage", lang);
    applyLanguage(lang);
}

function applyLanguage(lang: "es" | "en" | "fr") {
    
    /* LOGIN */

    document.querySelector("#neon-text")!.innerHTML = languages[lang].welcome;
    document.querySelector("#neon-subtitle")!.textContent = languages[lang].signInPrompt;
    document.querySelector("#login-button")!.textContent = languages[lang].startButton;

    /* HOME */

    document.querySelector('#welcome')!.textContent = languages[lang].homeWelcome;
    document.querySelector('#logout-button')!.textContent = languages[lang].logoutButton;
}

/*------------ EVENTOS ------------*/

document.getElementById("esBtn")!.addEventListener("click", () => changeLanguage("es"));
document.getElementById("enBtn")!.addEventListener("click", () => changeLanguage("en"));
document.getElementById("frBtn")!.addEventListener("click", () => changeLanguage("fr"));

document.addEventListener("DOMContentLoaded", () => {
    const selectedLanguage = localStorage.getItem("selectedLanguage") as "es" | "en" | "fr";
    applyLanguage(selectedLanguage || "en");
});