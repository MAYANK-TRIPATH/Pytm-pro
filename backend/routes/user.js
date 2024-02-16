const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");
const router = express.Router();

//signup and signin routes


//SIGNUP
const signupSchema = zod.object({
    username: zod.string().email(),
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

//SIGNIN

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

router.post("/signin", async (req,res) => {
    const { success } = signinBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

    const updateSchema = zod.object({
        password: zod.string().optional(),
        firstname: zod.string().optional(),
        lastname: zod.string().length.optional(),
    })

    router.put("/", authMiddleware, async (req, res) => {
        const { success } = updateBody.safeParse(req.body)
        if (!success) {
            res.status(411).json({
                message: "Error while updating information"
            })
        }

        await User.updateOne(req.body, {
            id: req.userId
        })

        res.json({
            message: "Update Succesfully"
        })
    })

    router.get("/bulk", async (req, res) => {
        const filter =req.query.filter || "";

        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
                
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        })

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })

    })

module.exports = router;