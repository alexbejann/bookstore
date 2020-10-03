// logout
import {loadNavigation, newElement, sendJSON} from "./util.js";

// grab form controls from the DOM
const
    logoutButton = document.getElementById('logout')

window.onload = (event) =>{

    loadNavigation('bids');

    sendJSON({ method: 'GET', url: '/books/bids' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            console.log('Creating table...')
            createTable(response)
        } else {
            alert(err);
            console.error(err);
        }
    })

};

const createTable = (response)=>{
    for (let index=0; index < response.length; index++)
    {
        createBids(response[index]);
    }
}

// create auction element
const createBids = (bid)=>{
    const aucContainer =document.getElementById('bids_container'),
          container = aucContainer.appendChild(newElement('tr','','','',`${bid.id}`));
    container.appendChild(newElement('td',`${bid.title}`,'','',''));
    container.appendChild(newElement('td',`${bid.price}`,'','',''));
    container.appendChild(newElement('td',`${bid.time}`,'','',''));
    //container.appendChild(newElement('td',`${bid.best}`,'','',''));
    // add actions
    const actionContainer = container.appendChild(newElement('td','','','',''));
    const deleteBid = actionContainer.appendChild(newElement('i','','fa fa-trash','',''));
    deleteBid.addEventListener('click', event=>{
        event.preventDefault();

        sendJSON({ method: 'DELETE', url: `books/${bid.id}` }, (err, response) => {
            // if err is undefined, the send operation was a success
            if (!err) {
                const book_del = document.getElementById(bid.id);
                book_del.remove();
                console.log('bid deleted')
            } else {
                alert(err)
                console.error(response);
            }
        })
    });
}