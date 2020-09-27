// import utilities from util.js
import { sendJSON, logout, createBook, sessionCookie, hideElement, loadNavigation } from './util.js'

// grab form controls from the DOM
const
    logoutButton = document.getElementById('logout');

function createBooks(response)
{
    const container = document.getElementById('book-container');
    for (let index = 0; index < response.length; index++)
    {
        container.appendChild(createBook(response[index]));
    }
}

// on page load get all the books
window.onload = (event) =>{

    loadNavigation();

    sendJSON({ method: 'GET', url: '/books' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            createBooks(response);
        } else {
            alert(err);
            console.error(err);
        }
    })
};

// logout
logoutButton.addEventListener('click', (event) =>{
    // Logout
    logout();
})