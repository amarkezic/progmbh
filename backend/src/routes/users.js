import express from "express"
import { User } from "../schemas/users"

let router = express.Router()

router.post("/register", async (req, res) => {
    let user = new User(req.body)
    try {
        await user.save()
    } catch (e) {
        return res.send(e.errors)
    }

    return res.send("")
})

router.post("/login", async (req, res) => {
    let user = await User.findOne({username: req.body.username})
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(err || !isMatch) {
            return res.send("error")
        } else {
            return res.send("logged in")
        }
    })

    
})

export default router