import {loadNavigation, sendJSON} from "./util.js";

window.onload = (event) =>{

    loadNavigation('users');

    /*sendJSON({ method: 'GET', url: '/users' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            //createUsersTable(response);
        } else {
            alert(err);
            console.error(err);
        }
    })*/
};

const createUsersTable= (response) =>{
    console.log('create users')
}