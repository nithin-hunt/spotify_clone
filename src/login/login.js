import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const APP_URL = import.meta.env.VITE_APP_URL;
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";

const authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`;
    window.open(url, "login", "width=800,height=600");
}

document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("login-to-spotify");
    loginButton.addEventListener("click", authorizeUser);

})

window.setItemsInLocalStorage = ({ accessToken, tokenType, expiresIn }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_TYPE, tokenType);
    localStorage.setItem(EXPIRES_IN, (Date.now() + (expiresIn * 1000)));
    window.location.href = APP_URL;

}

window.addEventListener("load", () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
        window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    }

    if (window.opener !== null && !window.opener.closed) {

        window.focus();
        if (window.location.href.includes("error")) {
            window.close();
        }

        const { hash } = window.location;
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");

        // #access_token = BQCpXqx_mZoHhCEIoAGbjxJqIG - QSlTm6zyM_zN6dqZhpvXxYGfF7ZKeLQd9dM3NX5QvJmQ1ovlOVGrsAw_vrURimONPMfRhn2J - mZXWlhnNVTZAcxvULe3YMNZZGhmr - PaZVpfBYDUbnsfQ9KFiFzFttfElKp - xwchWrbkoB8rf6_ggOLntd6jo0iUVMgz_FgFWAFbKffJHmspKCUzWS03NrTEdsXlKTBBiIQ & token_type=Bearer & expires_in=3600

        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");
        if (accessToken) {
            window.close();
            window.opener.setItemsInLocalStorage({ accessToken, tokenType, expiresIn });
        } else {
            window.close();
        }
    }
})