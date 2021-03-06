// import utilities from util.js
import {sendJSON, validateInputControl, loadNavigation, newElement, newElem} from './util.js'

// on page load get all the bids and hide nav
window.onload = (event) =>{

    loadNavigation('administration')

    sendJSON({ method: 'GET', url: '/books' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            createAuctionTable(response);
        }
        else {
            alert(err);
            console.error(err);
        }
    })
};

//create auction
const createAuctionTable = (response) =>{

    response.forEach((item)=>{
        createAuctionElement(item)
    });
    //create add book form
    createForm();
    //validate form
    validateForm()
}
// create auction element
const createAuctionElement = (book)=>{
    const aucContainer =document.getElementById('auction_table'),
          container = aucContainer.appendChild(newElement('tr','','','',`${book.id}`));
    container.appendChild(newElement('td',`${book.title}`,'','','title'));
    container.appendChild(newElement('td',`${book.author}`,'','','author'));
    container.appendChild(newElement('td',`${book.year}`,'','','year'));
    container.appendChild(newElement('td',`${book.price}`,'','','price'));
    container.appendChild(newElement('td',`${book.time}`,'','','time'));
    // add actions
    const actionContainer = container.appendChild(newElement('td','','','','')),
          edit = actionContainer.appendChild(newElement('i','','fa fa-pencil','','edit'));

    const bookValues = [book.title, book.author, book.year, book.price, book.time]
    edit.addEventListener('click', event =>{
        event.preventDefault();
        //hide delete and edit buttons
        deleteBook.style.display = "none";
        edit.style.display = "none";
        for (let index = 0; index < 5; index++)
        {
            let child = container.children[index];
            update(child)
        }

        const save = actionContainer.appendChild(newElement('i','','fa fa-save','','save'));

        save.addEventListener('click', event =>{
            event.preventDefault();

            //Save changes
            const val = [];

            for (let index  = 0; index < 5 ; index++)
            {
                let currentChild = container.children[index];
                if (!(currentChild.firstChild.value === bookValues[index]))
                {
                    //console.log(`the ${currentChild.id} have been changed: `+currentChild.firstChild.value, bookValues[index]);
                    val.push({
                        fieldChanged: currentChild.id,
                        newValue: "" + currentChild.firstChild.value,
                    })
                }
            }
            const body = {changes: val};
            // send PUT request
            sendJSON({ method: 'PUT', url: '/books/'+book.id, body }, (err, response) => {
                // if err is undefined, the send operation was a success
                if (!err) {
                    // reload page to see changes
                    location.reload()
                } else {
                    alert(err)
                    console.error(response);
                }
            })
        })
    })
    const deleteBook = actionContainer.appendChild(newElement('i','','fa fa-trash','',''));
    deleteBook.addEventListener('click', event=>{
        event.preventDefault();

        sendJSON({ method: 'DELETE', url: `books/${book.id}` }, (err, response) => {
            // if err is undefined, the send operation was a success
            if (!err) {
                const book_del = document.getElementById(book.id);
                book_del.remove();
                alert('Book deleted!')
            } else {
                alert(err)
                console.error(response);
            }
        })
    });
}

function update(child)
{
    if (child != "[object HTMLInputElement]")
    {
        //Get contents off cell clicked
        let content = child.firstChild.nodeValue;
        //Switch to text input field
        child.innerHTML = "<input type = 'text' value = '" + content + "'/>";
    }
}
// validate login form
function validateForm() {

    const
        nameField = document.getElementById('name_field'),
        authorField = document.getElementById('author_field'),
        yearField = document.getElementById('year_field'),
        priceField = document.getElementById('price_field'),
        timeField = document.getElementById('time_field'),
        countryField = document.getElementById('country_field'),
        addButton = document.getElementById('add')

    const
        nameOk = nameField.value.trim().length > 0,
        authorOk = authorField.value.trim().length > 0,
        yearOk = yearField.value.trim().length > 0,
        priceOk = priceField.value.trim().length > 0,
        timeOk = timeField.value.trim().length > 0,
        countryOk = countryField.value.trim().length >0,
        addOk = nameOk && authorOk && yearOk && priceOk
    // provide visual feedback for controls in a 'bad' state
    validateInputControl(nameField, nameOk, 'Name field is required!')
    validateInputControl(authorField, authorOk, 'Author field is required!')
    validateInputControl(yearField, yearOk, 'Year field is required!')
    validateInputControl(priceField, priceOk, 'Price field is required!')
    validateInputControl(timeField, timeOk, 'Time field is required!')
    validateInputControl(countryField, countryOk, 'Country field is required!')
    // enable/disable click
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
    form.appendChild(createInputField('year_field','number','Year','year'));
    form.appendChild(createInputField('price_field','number','Price','price'));
    form.appendChild(createInputField('time_field','time','End time','end_time'));
    form.appendChild(createInputField('country_field','text','Country','country'));
    const formControl = document.createElement('div');
    formControl.className = 'form-control';
    formControl.appendChild(document.createElement('span'));
    form.appendChild(formControl);
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

//create input field
function createInputField(id, type, placeholder, name)
{
    const formControl = document.createElement('div');
    formControl.className = 'form-control';
    const inputField = document.createElement('input');
    formControl.appendChild(inputField);
    formControl.appendChild(document.createElement('span'));
    inputField.type = type;
    inputField.placeholder = placeholder;
    inputField.name = name;
    inputField.id = id;
    return formControl;
}