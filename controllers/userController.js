const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const { errorHandler } = require("../auth");



// USER REGISTER
module.exports.registerUser = async (req, res) => {
    try {

        // VALIDATIONS FIRST (for 400 errors)

        if (
            typeof req.body.firstName !== "string" ||
            typeof req.body.lastName !== "string"
        ) {
            return res.status(400).send(false);
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ message: "No email found" });
        }

        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).send({
                error: "Password must be atleast 8 characters"
            });
        }

        if (!email.includes("@")) {
            return res.status(400).send({ error: "Email invalid" });
        }


        if (!req.body.mobileNo || req.body.mobileNo.length < 11) {
            return res.status(400).send({
                error: "Mobile number is invalid"
            });
        }

        const duplicateEmail = await User.findOne({ email: req.body.email });
        if (duplicateEmail) {
            return res.status(409).send("Duplicate Email Found!");
        }

        // CREATE USER
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            mobileNo: req.body.mobileNo
        });

        const savedUser = await newUser.save();

        return res.status(201).send({
            message: "Registered successfully"
        });


    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email is provided and valid
        if (!email || !email.includes("@")) {
            return res.status(400).send({ error: "Invalid email" });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Email not found
        if (!user) {
            return res.status(404).send({ error: "Email not found" });
        }

        // Wrong password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ error: "Email and password do not match" });
        }

        // Success: return access token
        return res.status(200).send({
            access: auth.createAccessToken(user)
        });

    } catch (err) {
        return errorHandler(err, req, res);
    }
};



// RETRIEVE USER
module.exports.retrieveUser = (req, res) => {
    const userId = req.user.id; // get ID from JWT token

    if (!userId) {
        return res.status(401).send({ error: "Invalid token" });
    }

    User.findById(userId)
        .then(user => {
            if (!user) return res.status(404).send({ error: "User not found" });

            return res.status(200).send({ user });
        })
        .catch(err => errorHandler(err, req, res));
};


// SET USER AS ADMIN (ADMIN ONLY)
module.exports.setUserAsAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { isAdmin: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "User set as admin",
            user
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};




// CHANGE PASSWORD
module.exports.updatePassword = (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).send({ message: "New password is required" });
    }

    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            user.password = bcrypt.hashSync(newPassword, 10);
            return user.save();
        })
        .then(() => {
            return res.status(200).send({
                message: "Password reset successfully"
            });
        })
        .catch(err => errorHandler(err, req, res));
};

















