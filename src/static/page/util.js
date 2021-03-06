// send HTTP request, possibly with JSON body, and invoke callback when JSON response body arrives
export function sendJSON({ method, url, body }, callback) {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(undefined, JSON.parse(xhr.responseText))
        } else {
            callback(new Error(xhr.responseText))
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
// create cookie
function createCookie(token){
    document.cookie = "token=" + token + ";samesite=strict;";
}

// reset token
function resetToken() {
    // clear token when user logs out
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function getTokenPayload() {
    const cookie = sessionCookie();
    if (cookie) {
        // extract JSON payload from token
        return JSON.parse(atob(cookie.split('.')[1]))
    }
    return undefined
}

// utility functions adds/removes CSS class 'bad' upon validation
export function validateInputControl(element, ok, message) {
    const formControl = element.parentElement;
    const span = formControl.querySelector('span');
    if (ok) {
        element.classList.remove('bad')
        span.innerText = '';
    } else {
        element.classList.add('bad')
        span.innerText = message;
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

// create element
export function newElem(tagName, textContext, className)
{
    const nTag = document.createElement(tagName);
    nTag.className = className;
    nTag.appendChild(document.createTextNode(textContext));
    return nTag;
}

// check if cookie exists
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
        // set display prop for element
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

// load NAV bar
export function loadNavigation(active)
{
    // if cookie exists hide login button
    const payload = getTokenPayload();
    const cookie = sessionCookie();
    const nav = document.querySelector('nav');

    const home = nav.appendChild(newElem('a','Home',
                        active === 'home' ? 'active' : '' ));
    home.href = 'index.html';
    //if user is logged in
    if (cookie)
    {
        const bids = nav.appendChild(newElem('a','My Bids',
                            active === 'bids' ? 'active' : '' ));
        bids.href = 'bids.html';
        //check if user is admin
        if (payload.roles[0] === 'admin')
        {
            const administration = nav.appendChild(newElem('a','Administration',
            active === 'administration' ? 'active' : '' ));
            administration.href = 'administration.html';

            const users = nav.appendChild(newElem('a','Users',
                                active === 'users' ? 'active' : '' ));
            users.href = 'users.html';
        }
        const logout= nav.appendChild(newElem('a','Logout',''));
        logout.href = '/';
        logout.addEventListener('click', (event) =>{
            // Logout
            event.preventDefault();
            // delete request
            sendJSON({ method: 'DELETE', url: '/auth'}, (err, response) => {
                // if err is undefined, the send operation was a success
                if (!err) {
                    // the book
                    console.log(response)
                    //delete cookie
                    resetToken();
                    //alert user
                    alert('You have successfully logged out!')
                    //redirect
                    window.location.replace('./index.html');
                } else {
                    //return the error
                    alert(err);
                }
            })
        })
    }
    else
    {
        const  login= nav.appendChild(newElem('a','Login',
                            active === 'login' ? 'active' : '' ));
        login.href = 'login.html';
    }
}