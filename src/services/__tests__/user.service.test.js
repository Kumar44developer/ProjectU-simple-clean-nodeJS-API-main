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


test('must add a user', (t) => {
    const expectedId = 1;

    const user = userService.addUser(sampleUser);

    t.is(user.id, expectedId);
    t.deepEqual(user, {id: expectedId, ...sampleUser});
});



























