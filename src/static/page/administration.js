// import utilities from util.js
import { sendJSON, validateInputControl, logout, hideElement, sessionCookie} from './util.js'

// grab form controls from the DOM
const
    form = document.querySelector('auction_form'),
    nameField = form.querySelector('input[type="text"]'),
    authorField = form.querySelector('input[type="text"]'),
    yearField = form.querySelector('input[type="text"]'),
    priceField = form.querySelector('input[type="text"]'),
    addButton = form.querySelector('input[type="submit"]')

// on page load get all the bids and hide nav
window.onload = (event) =>{

    if (sessionCookie() != null)
    {
        hideElement(document.getElementById('login'));
    }
    else
    {
        hideElement(document.getElementById('logout'));
        hideElement(document.getElementById(''));
        hideElement(document.getElementById('login'));
    }

    sendJSON({ method: 'GET', url: '/bids' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {

        } else {
            alert(err);
            console.error(err);
        }
    })
};

// validate login form
function validateForm() {
    const
        usernameOk = usernameField.value.length > 0,
        passwordOk = passwordField.value.length > 0,
        registerOk = usernameOk && emailOk &&passwordOk
    // provide visual feedback for controls in a 'bad' state
    validateInputControl(usernameField, usernameOk)
    validateInputControl(passwordField, passwordOk)
    validateInputControl(registerButton, registerOk)
    // enable/disable click of login button
    addButton.disabled = !registerOk
}

// validate form on every input event
form.addEventListener('input', validateForm)

// validate form on page load
validateForm()

//log out

