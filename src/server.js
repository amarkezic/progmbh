import express from "express"

let app = express()

app.get('/', (req, res) => {
    return res.send("Hello world")
})

app.listen(9001, "localhost", () => {
    console.log("Listening on port 9001")
})