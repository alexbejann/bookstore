// JWT token string with header, payload and signature
let sessionToken

// send HTTP request, possibly with JSON body, and invoke callback when JSON response body arrives
export function sendJSON({ method, url, body }, callback) {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            callback(undefined, JSON.parse(xhr.responseText))
        } else {
            callback(new Error(xhr.statusText))
        }
    })
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (sessionToken !== undefined) {
        xhr.setRequestHeader('Authorization', `Bearer ${sessionToken}`)
    }
    xhr.send(body !== undefined ? JSON.stringify(body) : undefined)
}

export function saveToken(token) {
    //TODO save token in a cookie not in localstorage so you avoid CSRF and XSS attacks
    createCookie(token);
}

function createCookie(token){
    document.cookie = "token=" + token + ";samesite=strict;";
}

function resetToken() {
    // clear token when users logs out
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function logout()
{
    resetToken();
    alert('You have successfully logged out!');
}

export function getTokenPayload() {
    if (sessionToken) {
        // extract JSON payload from token string
        return JSON.parse(atob(sessionToken.split('.')[1]))
    }
    return undefined
}

// utility functions adds/removes CSS class 'bad' upon validation
export function validateInputControl(element, ok) {
    if (ok) {
        element.classList.remove('bad')
    } else {
        element.classList.add('bad')
    }
}

// create element
export function newElement(tagName, textContext, className, name, id)
{
    const nTag = document.createElement(tagName);
    nTag.className = className;
    nTag.name = name;
    nTag.id = id;
    nTag.appendChild(document.createTextNode(textContext));
    return nTag;
}

// create book for index.html
export function createBook(book)
{
    const nTag = newElement('section', '', 'auction_box', '');
    const bookTitle = nTag.appendChild(newElement('a', `${book.title}`, 'auction_title', '',`${book.id}`));
    bookTitle.href = 'auction.html';
    nTag.appendChild(newElement('p', `Author: ${book.author}`, 'auction_description'));
    nTag.appendChild(newElement('p', `Year: ${book.year}`, 'auction_description'));
    const bidsContainer = nTag.appendChild(newElement('div', '','auction_bid',''));
    bidsContainer.appendChild(newElement('span', `${book.price}`, 'auction_bid_price',''));
    bidsContainer.appendChild(newElement('span',`${book.time}`,'auction_bid_time',''));
    return nTag;
}

// check of cookie exists
export function sessionCookie()
{
    let end;
    let dc = document.cookie;
    let prefix = "token=";
    let begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        end = document.cookie.indexOf(";", begin);
        if (end == -1)
        {
            end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

// toggle elements
export function hideElement(element)
{
    if (element.style.display === "none")
    {
        // store the display in the local storage
        // todo fix this to trigger all elements across all pages
        localStorage.setItem('display','block')
        // set display prop for element
        element.style.display = "block";
    } else {
        // same
        localStorage.setItem('display','none')
        element.style.display = "none";
    }
}

// load NAV bar
export function loadNavigation()
{
    // if cookie exists hide login button
    if (sessionCookie() != null)
    {
        hideElement(document.getElementById('login'));
    }
    else
    {
        hideElement(document.getElementById('logout'));
        hideElement(document.getElementById('bids'));
        hideElement(document.getElementById('admin-board'));
    }
}
