import { StatusCodes } from 'http-status-codes';
import pino from 'pino';
import userService from '../services/user.service.js';

const logger = pino();

const STATUS = {
success: true,
failure: false
};

const getAllUsers = (req, res) => {
const users = userService.getAllUsers();

```
if (users && users.length) {
    return res.status(StatusCodes.OK).json(users);
}

return res.status(StatusCodes.NOT_FOUND).json({
    status: STATUS.failure,
    message: 'No users found.',
});
```
};

// Get single user
const getUser = (req, res) => {
const id = parseInt(req.params.id, 10);
const user = userService.getUser(id);

```















































