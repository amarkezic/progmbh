import express from "express"
import { todo, users} from "./routes"
import config from "config"
import bodyParser from "body-parser"

const PORT = config.get("port")

let app = express()

// For parsing jsons
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routes
app.use("/todos", todo)
app.use("/users", users)
app.get("/", (req, res) => {
    return res.send("This is root")
})
app.listen(PORT, "0.0.0.0", () => {
    console.log("Listening on port",PORT)
})