import express ,{Router} from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import { body } from "express-validator";
const router:Router = express.Router();

router.get('/all',getUsers)

router.post('/create'
    ,body('name',"Name must be a string value").isString().isLength({
        min: 5,
    }),
    body('email',"Please enter a proper email").isEmail()
    ,createUser);

export default router;