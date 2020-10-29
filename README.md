# Assignment 2
-  **Daniel-Alexandru Bejan**
-  **Cosmin George Mucalau**

## Books Auction Store
To run project do `npm run dev`. This command will start the server to listen on `http://localhost:3000
`.
## Admin user credentials
- username: __alex__
- password: __pass123__

### Requirements accomplished

- I want a main(index) page with:

    -[x] the ability to log in and register
    -[x] a list of auctions and their corresponding attributes with built in pagination.
    -[x] a searchbar that can be used to search auctions
    -[x] the auction list should be filterable on at least three attributes. I.e. a dropdown to filter on price ranges, checkboxed for colors or a slider for a distance.
- I want a details page for each auction. This page should have:
    -[x] a list of all bids and attributes
    -[x] an option to place a bid(user can place a bid only if it's logged in).
- I want an adminpage where I:
    -[x] can add auctions
    -[x] can modify auctions
    -[x] can delete auctions
- Create form handling. Form handling should have at least:
    -[x] A red border (CSS class wrong) around the text input when an incorrect bid was placed
    -[x] A red border around the price input field when an incorrect price was entered when creating a new auction
    -[x] An error message when trying to place a bid without being logged in
    -[x] An error message for login errors
    -[x] Email check on registration:
        - Performed by our regex:`[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.(com|nl)`
        - This part `[a-zA-Z0-9_.+-]` checks if a string before @
        - This part `[a-zA-Z0-9-]+\` checks if after @  
        - The email should end in .com or .nl (`(com|nl)`)
    -[x] Password check regEx at registration:
        - This is our regEx for password `(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]){6,}`.
        - `(?=.*[a-z])` checks if the string contains at least a lowercase char.
        - `(?=.*[A-Z])` this part checks for at least one uppercase char.
        - `(?=.*[0-9])` this part checks if the string contains at least one digit 
        - `{6,}` checks if the string is at least 6 char long. 

## User without login

- Can sign up
- Filter books on main page based on Authors, Years and Country.
- Can also view the book detail page 

## Normal User

- Login logout
- View books on main page
    - __Add__ bid to book on detail page
- See his own bids in bids.html
    - __Delete__ bid 

## Admin user 

- Can see all users in Users section (username, email and role)
- Can manage all auctions in Administration section 
    - admin can **modify**, **delete** current auctions/books
    - can **add** a new auction/book

## Project structure
- src
    - api
        - books.js
        - isAdmin.js
        - isAuthenticated.js
        - tokenValidation.js
        - user.js
    - data
        - books.json
        - user.json
    - rest
        - requests.rest
        - userCalls.rest
    - static
        - page
            - administration.js
            - auction.js
            - bids.js
            - index.js
            - login.js
            - register.js
            - users.js  
            - util.js
        - public 
        - administration.html
        - auction.html
        - bids.html
        - index.html
        - login.html
        - register.html
        - users.html
    - errorHandlers.js
    - index.js 

## Complex code from static files explained

## util.js
- Token handlers received from the server:
    - `createCookie(token)` is creating the cookie based on the token received from the server called from `saveToken(token)`
    - `sessionCookie()` is checking and is returning the cookie value, we are searching for our cookie based on given name in `createCookie(token)` which is always **token**.
    - `resetToken()` deletes the cookie by setting a past date, this will trigger cookie removal
    - `getTokenPayload()` is extracting the token payload, so we can use the payload for further checks such as: role checking or username check. 
- Loading navigation `loadNavigation(active)` this is called on every page in the window.onload in order to load the page navigation, the active param is the current page name. This method is checking automatically(based on the cookie, if exists) what should the user see and will create and load all necessary navigation items.
- `validateInputControl(element, ok, message)` is called when we need some error handlers in a form / input field. Our solution for error handling is to have every input field wrapped in a div which consists in input, and a span which is going to show our error message, if necessary. 
- `sendJSON` has been modified to send an error if the status is different the `xhr.status >= 200 && xhr.status < 300`. Also, the method will add a Bearer header with a token if the session cookie is present.
## index.js 
- During onload function we are also creating the filters in `createBooks(response)` we have 3 arrays which will contain our values for each filter and `createFilter(category,value, id)` will take care of creating the filters and checkboxes. The idea is simple if a checked(the checkbox) we clear all children and do a request to server to get all books based on that filter.

## administration.js
- `createAuctionElement = (book)` is used to create a row for a table. At the same time we are also adding the click listeners for the edit, delete and save changes. When the edit button clicked other buttons are disabled and `update(child)` is called within a loop. This function is adding inside the **<td>** element an input element to edit the fields. When save button clicked we check for changes in this piece of code and do the put request to server. 
`//Save changes
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
            }` 
