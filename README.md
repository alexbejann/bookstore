# Assignment 2

## The case
Build an auction site for a product or service of your choosing. Some examples are

- Trips
- Sporting goods
- Art

## The assignment

Now that we have a RESTful backend it is time to build a simple frontend. We will use plain vanilla Javascipt for this assignment. The use of other web technologies is not allowed. To help you along we have already created the HTML and CSS for you. Clone the project from [HBO ICT Lab](https://repo.hboictlab.nl/template/20975353) and add your own Javascript to meet the requirements below.

You are not supposed to alter the provided HTML and CSS.

### Functional requirements

- I want a main(index) page with:

    - the ability to log in and register
    - a list of auctions and their corresponding attributes with built in pagination.
    - a searchbar that can be used to search auctions
    - the auction list should be filterable on at least three attributes. I.e. a dropdown to filter on price ranges, checkboxed for colors or a slider for a distance.
- I want a details page for each auction. This page should have:
    - a list of all bids and attributes
    - an option to place a bid
- I want an adminpage where I:
    - can add auctions
    - can modify auctions
    - can delete auctions
- Create form handling. Form handling should have at least:
    - A red border (CSS class wrong) around the text input when an incorrect bid was placed
    - A red border around the price input field when an incorrect price was entered when creating a new auction
    - An error message when trying to place a bid without being logged in
    - An error message for login errors
    - A check for the  email address on registration:
        - contains a @
        - there is text before the @
        - there is text after the @
        - ends with .nl or .com
    - A check for the password at registration:
        - at least 6 characters
        - should contain at least one capital letter
        - should contain at least one digit

### Non-functional requirements
- Do not alter HTML and CSS
- Do not use client-side Javascript libraries
- Use the browsers XMLHttpRequest API to make HTTP to the backend

## Grading
This assignment has to be handed in on Blackboard. The ultimate deadline is

**monday 09:00 in week 9.**

What do we expect you to hand in:

- The complete code of both the backend and frontend
- A short manual in Markdown on how they work together
