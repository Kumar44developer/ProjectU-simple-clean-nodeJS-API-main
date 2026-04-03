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

















































