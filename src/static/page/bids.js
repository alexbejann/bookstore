// logout
import {logout} from "./util";

// grab form controls from the DOM
const
    logoutButton = document.getElementById('logout')

logoutButton.addEventListener('click', (event) =>{
    // Logout
    logout();
})