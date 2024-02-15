const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const router = express.Router();

//signup and signin routes

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstname: zod.string(),
    password: zod.string()
})
router.post("/signup", async (req,res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = User.findOne({
        username: body.username
    })

    if (user._id) {
        return res.json({
            message: "Email already taken"
        })
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })
})

module.exports = router;