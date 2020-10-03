// import utilities from util.js
import {sendJSON, validateInputControl, loadNavigation, newElement, newElem} from './util.js'

// on page load get all the bids and hide nav
window.onload = (event) =>{

    loadNavigation('administration')

    sendJSON({ method: 'GET', url: '/books' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            createAuctionTable(response);
        } else {
            alert(err);
            console.error(err);
        }
    })

    validateForm();
};

//create auction
const createAuctionTable = (response) =>{

    for (let index=0; index < response.length; index++)
    {
        createAuctionElement(response[index]);
    }
    createForm();
}
// create auction element
const createAuctionElement = (book)=>{
    const aucContainer =document.getElementById('auction_table'),
          container = aucContainer.appendChild(newElement('tr','','','',`${book.id}`));
    container.appendChild(newElement('td',`${book.title}`,'','',''));
    container.appendChild(newElement('td',`${book.author}`,'','',''));
    container.appendChild(newElement('td',`${book.year}`,'','',''));
    container.appendChild(newElement('td',`${book.price}`,'','',''));
    container.appendChild(newElement('td',`${book.time}`,'','',''));
    // add actions
    const actionContainer = container.appendChild(newElement('td','','','','')),
          edit = actionContainer.appendChild(newElement('i','','fa fa-pencil','',''));
    edit.addEventListener('click', event =>{
        event.preventDefault();

        // todo append boxes to edit the book detail do it with innerhtml
    })
    const deleteBook = actionContainer.appendChild(newElement('i','','fa fa-trash','',''));
    deleteBook.addEventListener('click', event=>{
        event.preventDefault();

        sendJSON({ method: 'DELETE', url: `books/${book.id}` }, (err, response) => {
            // if err is undefined, the send operation was a success
            if (!err) {
                const book_del = document.getElementById(book.id);
                book_del.remove();
                console.log('book deleted')
            } else {
                alert(err)
                console.error(response);
            }
        })
    });
}

// validate login form
function validateForm() {

    const
        nameField = document.getElementById('name_field'),
        authorField = document.getElementById('author_field'),
        yearField = document.getElementById('year_field'),
        priceField = document.getElementById('price_field'),
        timeField = document.getElementById('time_field'),
        addButton = document.getElementById('add')

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

// create add form
function createForm()
{
    // create containers
    const container = document.getElementsByClassName('row')[2],
          form = container.appendChild(newElement('form', '','auction_form','form_action2','add_form'));
    form.method = '';
    form.action = '';

    // create fields
    form.appendChild(newElem('h1','Add book','auction_title'));
    form.appendChild(createInputField('name_field','text','Name','name'));
    form.appendChild(createInputField('author_field','text','Author','author'));
    form.appendChild(createInputField('year_field','text','Year','year'));
    form.appendChild(createInputField('price_field','text','Price','price'));
    form.appendChild(createInputField('time_field','text','End time','end_time'));
    form.addEventListener('input', validateForm);
    // add button
    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.id= 'add';
    submit.value = 'Add';
    submit.addEventListener('click', event => {
        // do not submit form (the default action of a submit button)
        event.preventDefault()

        const
            nameField = document.getElementById('name_field'),
            authorField = document.getElementById('author_field'),
            yearField = document.getElementById('year_field'),
            priceField = document.getElementById('price_field'),
            timeField = document.getElementById('time_field');
        // construct request body
        const body = {
                    name: nameField.value,
                    author: authorField.value,
                    year: yearField.value,
                    price: priceField.value,
                    time: timeField.value
                    }
        // send post
        sendJSON({ method: 'POST', url: '/books', body }, (err, response) => {
            // if err is undefined, the send operation was a success
            if (!err) {
                console.log('Book added!')
                location.reload();
            }
            else {
                alert(err)
                console.error(response);
            }
        })
    })
    form.appendChild(submit);
}

function createInputField(id, type, placeholder, name)
{
    const inputField = document.createElement('input');
    inputField.type = type;
    inputField.placeholder = placeholder;
    inputField.name = name;
    inputField.id = id;
    return inputField;
}