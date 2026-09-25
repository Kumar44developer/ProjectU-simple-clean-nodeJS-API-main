import userDAO from '../models/persistence/user.dao.js';

const getAllUsers = () => {
    return userDAO.getAll();
};

const getUser = (userId) => {
    return userDAO.get(userId);
};

const addUser = (details) => {
    return userDAO.insert(details);
};

const updateUser = (userId, details) => {
    return userDAO.update(userId, details);
};

const removeUser = (userId) => {
    return userDAO.remove(userId);
};

export default {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    removeUser,
};
