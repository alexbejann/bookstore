// import utilities from util.js
import { sendJSON, validateInputControl, loadNavigation } from './util.js'

// grab form controls from the DOM
const
    form = document.querySelector('main form'),
    usernameField = form.querySelector('input[type="text"]'),
    emailField = form.querySelector('input[type="text"]'),
    passwordField = form.querySelector('input[type="password"]'),
    registerButton = form.querySelector('input[type="submit"]')

// respond to click event on login button
registerButton.addEventListener('click', event => {
    // do not submit form (the default action of a submit button)
    event.preventDefault()
    // construct request body with new user information
    const body = { username: usernameField.value,
                   email: emailField.value,
                   password: passwordField.value }
    // send POST request with body to /credentials and wait for HTTP response
    sendJSON({ method: 'POST', url: '/users', body }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            alert('You\'re ready to log in')
            console.log(response);
        } else {
            alert(err);
            console.error(err);
        }
    })
})

// validate login form
function validateForm() {
    const
        passRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})$/,
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        usernameOk = usernameField.value.length > 0,
        emailOk = emailField.value.length > 0,
        passwordOk = passwordField.value.length > 0,
        registerOk = usernameOk && emailOk &&passwordOk
    // provide visual feedback for controls in a 'bad' state
    validateInputControl(usernameField, usernameOk)
    validateInputControl(emailField, emailOk)
    validateInputControl(passwordField, passwordOk)
    validateInputControl(registerButton, registerOk)
    // enable/disable click of login button
    registerButton.disabled = !registerOk
}

// validate form on every input event
form.addEventListener('input', validateForm)

// validate form on page load
validateForm()

// on page load show the right items on page
window.onload = (event) =>{

    loadNavigation('login');

};