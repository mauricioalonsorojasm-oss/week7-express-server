const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const verifyToken = require("../middlewares/auth.middlewares");



// POST "/api/auth/signup" => to create a new user in the database
// POST "/api/auth/login" => to verify the credentials of an existing user in the database
// GET "/api/auth/verify" => to verify the JWT stored in the frontend (only for the logged in users)

router.post("/signup", async (req, res, next) => {
    console.log("this is the request body: ", req.body);

    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({ errorMessage: "All fields (email, password, username) are required." });
        return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ errorMessage: "Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter." });
        return;
    }

    try {
        const foundUser = await User.findOne({ email: email });

        if (foundUser) {
            res.status(400).json({ errorMessage: "Email already exists. Please choose a different email." });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 12);




        const response = await User.create({ 
            email: email, 
            password:hashPassword, 
            username:username });
        res.status(201).json({ message: "User created successfully." });
    }


     catch (error) {
        next(error) }
});  
 

router.post("/login", async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password ) {
        res.status(400).json({ errorMessage: "Both fields (email and password) are required." });
        return;
    }



    try {      

        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            res.status(400).json({ errorMessage: "Email doesn't exists. Please check that you are trying to login with the right email." });
            return;
        }
        
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordCorrect) {
        res.status(400).json({ errorMessage: "Incorrect password. Please check that you are trying to login with the right password." });
        return;
    }
        const payload = { _id: foundUser._id, email: foundUser.email};
        //console.log("this is the payload: ", payload);

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, 
            { algorithm: "HS256", expiresIn: "7d" });
        //console.log("this is the authToken: ", authToken);

        res.status(200).json({ authToken: authToken, payload: payload });



        //res.send ("all good from login route");
    } catch (error) {
        next(error);
    }   
});


    router.get("/verify", verifyToken, (req, res) => {
        
        res.status(200).json({ payload: req.payload });
});

module.exports = router;