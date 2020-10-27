// import utilities from util.js
import { sendJSON, validateInputControl, loadNavigation } from './util.js'

// grab form controls from the DOM
const
    form = document.querySelector('main form'),
    usernameField = form.querySelector('input[placeholder="Username"]'),
    emailField = form.querySelector('input[placeholder="Email"]'),
    passwordField = form.querySelector('input[placeholder="Password"]'),
    passwordRepeatField = form.querySelector('input[placeholder="Password repeat"]'),
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
            alert('Account created!')
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
        //Minimum 6 characters, one lowercase, one uppercase and one digit
        passRegex =  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]){6,}/,
        // anything@anything.(com || nl)
        emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.(com|nl)/,
        usernameOk = usernameField.value.trim().length > 0,
        emailOk = emailRegex.test(emailField.value.trim()),
        passwordOk = passRegex.test(passwordField.value.trim()),
        passwordRepeatOK = passwordField.value.trim() === passwordRepeatField.value.trim(),
        registerOk = usernameOk && emailOk &&passwordOk && passwordRepeatOK;

    // provide visual feedback for controls in a 'bad' state
    validateInputControl(usernameField, usernameOk, 'Username field is required!')
    validateInputControl(emailField, emailOk, 'Email must be like: anything@anything.com/nl')
    validateInputControl(passwordField, passwordOk,'Password must be at least 6 characters long, one digit, one upper and lower case!')
    validateInputControl(passwordRepeatField, passwordRepeatOK, 'Password field doesn\'t match!')
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