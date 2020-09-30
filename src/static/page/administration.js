// import utilities from util.js
import { sendJSON, validateInputControl, logout, loadNavigation, newElement } from './util.js'

// grab form controls from the DOM
const
    form = document.getElementById('add_form'),
    nameField = document.getElementById('name_field'),
    authorField = document.getElementById('author_field'),
    yearField = document.getElementById('year_field'),
    priceField = document.getElementById('price_field'),
    timeField = document.getElementById('time_field'),
    addButton = form.querySelector('input[type="submit"]'),
    logoutButton = document.getElementById('logout')

// on page load get all the bids and hide nav
window.onload = (event) =>{

    loadNavigation()

    sendJSON({ method: 'GET', url: '/books' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            createAuctionTable(response);
        } else {
            alert(err);
            console.error(err);
        }
    })
};

//create auction
const createAuctionTable = (response) =>{

    for (let index=0; index < response.length; index++)
    {
        createAuctionElement(response[index]);
    }
}
// create auction element
const createAuctionElement = (book)=>{
    const aucContainer =document.getElementById('auction_table');
    const container = aucContainer.appendChild(newElement('tr','','','',''));
    container.appendChild(newElement('td',`${book.title}`,'','',''));
    container.appendChild(newElement('td',`${book.author}`,'','',''));
    container.appendChild(newElement('td',`${book.year}`,'','',''));
    container.appendChild(newElement('td',`${book.price}`,'','',''));
    container.appendChild(newElement('td',`${book.time}`,'','',''));
    // add actions
    const actionContainer = container.appendChild(newElement('td','','','',''));
    actionContainer.appendChild(newElement('i','','fa fa-pencil','',''));
    actionContainer.appendChild(newElement('i','','fa fa-trash','',''));
}

// validate login form
function validateForm() {
    const
        nameOk = nameField.value.length > 0,
        authorOk = authorField.value.length > 0,
        yearOk = yearField.value.length > 0,
        priceOk = priceField.value.length > 0,
        timeOk = timeField.value.length > 0,
        addOk = nameOk && authorOk && yearOk && priceOk
    // provide visual feedback for controls in a 'bad' state
    validateInputControl(nameField, nameOk)
    validateInputControl(authorField, authorOk)
    validateInputControl(yearField, yearOk)
    validateInputControl(priceField, priceOk)
    validateInputControl(timeField, timeOk)
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