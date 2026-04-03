import users from '../data/users.data.js';

// Get single user
const get = (userId) => {
return users.find((user) => user.id === userId);
};


// Get all users
const getAll = () => {
return users;
};

// Update user
const update = (userId, newDetails) => {
let userIndex = users.findIndex((user) => user.id === userId);

```
if (userIndex === -1) {
    return false;
}

const updatedUser = {
    ...users[userIndex],
    ...newDetails
};

users.splice(userIndex, 1, updatedUser);

return updatedUser;
```

};

// Insert user
const insert = (details) => {
const newUser = {
id: users.length + 1,
...details
};


























