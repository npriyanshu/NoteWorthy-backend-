import express ,{Router} from "express";
import { createUser, deleteUser, getUser, login, logout, updateUser } from "../controllers/userController.js";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares/auth.js";

const router:Router = express.Router();


// crud for user
router.route('/:id')
.put(isAuthenticated,updateUser)
    .delete(isAuthenticated,deleteUser);

router.get("/getUserData",isAuthenticated,getUser);

router.post('/register',
    body('name', "Name must be a string value and at least 3 characters long")
    .isString()
    .isLength({ min: 3 }),
body('email', "Please enter a valid email")
    .isEmail(),
body('password', "Password must be at least 6 characters long")
    .isString()
    .isLength({ min: 6 }),
    createUser);

    // login 

    router.post('/login',
body('email', "Please enter a valid email")
    .isEmail(),
body('password', "Password must be at least 6 characters long")
    .isString()
    .isLength({ min: 6 }),login);

    // logout

 router.get('/logout',logout)

export default router;
