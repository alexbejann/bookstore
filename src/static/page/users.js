import {loadNavigation, newElement, sendJSON} from "./util.js";

window.onload = (event) =>{

    loadNavigation('users');

    sendJSON({ method: 'GET', url: '/users' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            createUsersTable(response);
        } else {
            alert(err);
            console.error(err);
        }
    })
};

//create users table
const createUsersTable= (response) =>{
    response.forEach(item=>{
        createUserElement(item);
    });
}

//create user row
const createUserElement= (user)=>{
    //get containers
    const aucContainer =document.querySelector('main table');
    const container = aucContainer.appendChild(newElement('tr','','','',''));

    container.appendChild(newElement('td',`${user.username}`,'','',`${user.id}`));
    container.appendChild(newElement('td',`${user.email}`,'','',''));
    container.appendChild(newElement('td',`${user.roles}`,'','',''));
}