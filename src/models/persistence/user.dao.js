import users from '../data/users.data.js';

// Get single user
const get = (userId) => {
return users.find((user) => user.id === userId);
};



































