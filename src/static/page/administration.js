// import utilities from util.js
import { sendJSON, validateInputControl, logout, loadNavigation} from './util.js'

// grab form controls from the DOM
const
    form = document.querySelector('auction_form'),
    nameField = form.querySelector('input[type="text"]'),
    authorField = form.querySelector('input[type="text"]'),
    yearField = form.querySelector('input[type="text"]'),
    priceField = form.querySelector('input[type="text"]'),
    addButton = form.querySelector('input[type="submit"]'),
    logoutButton = document.getElementById('logout')

// on page load get all the bids and hide nav
window.onload = (event) =>{

    loadNavigation()

    sendJSON({ method: 'GET', url: '/bids' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            console.log(response)
        } else {
            alert(err);
            console.error(err);
        }
    })
};

// validate login form
function validateForm() {
    const
        nameOk = nameField.value.length > 0,
        authorOk = authorField.value.length > 0,
        yearOk = yearField.value.length > 0,
        priceOk = priceField.value.length > 0,
        addOk = nameOk && authorOk && yearOk && priceOk
    // provide visual feedback for controls in a 'bad' state
    validateInputControl(nameField, nameOk)
    validateInputControl(authorField, authorOk)
    validateInputControl(yearField, yearOk)
    validateInputControl(priceField, priceOk)
    validateInputControl(addButton, addOk)
    // enable/disable click of login button
    addButton.disabled = !addOk
}

// validate form on every input event
form.addEventListener('input', validateForm)

// validate form on page load
validateForm()

// logout
logoutButton.addEventListener('click', (event) =>{
    // Logout
    logout();
})