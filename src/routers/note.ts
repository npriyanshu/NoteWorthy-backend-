import express ,{Router} from "express";
// import { body } from "express-validator";
import { isAuthenticated } from "../middlewares/auth.js";

const router:Router = express.Router();

// crud for note

// router.route('/:id')
// .put(isAuthenticated,updateUser)
//     .delete(isAuthenticated,deleteUser);

// router.get("/get-notes",isAuthenticated,getNotes);
router.get("/",(req,res)=>{

    res.send("<h1>Notes</h1>")
})

// router.post('/register',
//     body('name', "Name must be a string value and at least 3 characters long")
//     .isString()
//     .isLength({ min: 3 }),
// body('email', "Please enter a valid email")
//     .isEmail(),
// body('password', "Password must be at least 6 characters long")
//     .isString()
//     .isLength({ min: 6 }),
//     createUser);




export default router;
