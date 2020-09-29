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
    if (sessionCookie() != null) {
        xhr.setRequestHeader('Authorization', `Bearer ${sessionCookie()}`)
    }
    xhr.send(body !== undefined ? JSON.stringify(body) : undefined)
}

export function saveToken(token) {
    // save token in a cookie not in localstorage so you avoid CSRF and XSS attacks
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
    sendJSON({ method: 'DELETE', url: '/'}, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            // the book
            resetToken();
            alert('You have successfully logged out!');
        } else {
            //return the error
            alert(err);
        }
    })
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

// check of cookie exists
export function sessionCookie()
{
    let end;
    // get cookies
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

// load NAV bar todo this should be replaced with a better approach
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
