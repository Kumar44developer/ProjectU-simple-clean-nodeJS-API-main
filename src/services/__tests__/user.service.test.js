import test from 'ava';

import userService from "../user.service";


let sampleUser;

test.beforeEach(() => {
    sampleUser = {
        name: 'Joe Doe',
        email: 'joedoe@email.com',
        city: 'New York',
        country: 'USA'
    };
});


test.after(() => {
    if (userService.getUser(2)) {
        console.info('Cleanup: User 2 is being removed.')
        userService.removeUser(2);
    }
})





























