import express from "express"
import { Todo } from "../schemas/todo"
import mail from "../utils/email"
import nodemailer from "nodemailer"
import { User } from "../schemas/users"

let router = express.Router()

const CHECK_EVERY = 1000 * 3600
const time = new Date()
time.setHours(23)

setInterval(async () => {
    let now = new Date()
    let mailClient = await mail

    if (time.getHours() >= now.getHours()) {
        let todos = await Todo.find({ date: { $lt: now } })
        let users = await User.find()
        let todosPerUser = []
        todos.forEach((todo) => {
            let user = users.find((userEntry) => userEntry._id == todo.user)
            if (typeof user !== "undefined") {
                // check if user is already in the table
                let userIndex = todosPerUser.findIndex((entry) => entry.user.id === user.id)
                if (userIndex === -1) {
                    todosPerUser.push({ user, todos: [todo] })
                } else {
                    todosPerUser[userIndex].todos.push(todo)
                }
            }
        })
        todosPerUser.forEach((entry) => {
            let text = "The folowing todos have expired: "
            entry.todos.forEach((todo) => {
                text += todo.name + ", "
            })
            let mailOptions = {
                from: '"Fred Foo 👻" <todo@example.com>', // sender address
                to: entry.user.email, // list of receivers
                subject: 'Todo\'s have expired', // Subject line
                text, // plain text body
                html: "<b>" + text + "</b>" // html body
            };

            // send mail with defined transport object
            mailClient.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        })

    } else {
        console.log("Not time yet")
    }
}, CHECK_EVERY)

router.get('/', async (req, res) => {
    let allTodos = await Todo.find({})
    return res.send(allTodos)
})

router.post('/', async (req, res) => {

    let newTodo = new Todo(req.body)
    try {
        await newTodo.save()
    } catch (e) {
        return res.send({ errors: e.errors })
    }

    return res.send(newTodo)
})

router.get('/:id', async (req, res) => {
    let todo = await Todo.findById(req.params.id)
    return res.send(todo);
})
router.get('/:id/done', async (req, res) => {
    await Todo.findOneAndUpdate({ _id: req.params.id }, { finished: true })

    let todo = await Todo.findOne({ _id: req.params.id })
    return res.send(todo);
})
router.get('/:id/undone', async (req, res) => {
    await Todo.findOneAndUpdate({ _id: req.params.id }, { finished: false })

    let todo = await Todo.findOne({ _id: req.params.id })
    return res.send(todo);
})
router.put('/:id', async (req, res) => {
    await Todo.findOneAndUpdate({ _id: req.params.id }, req.body)

    let todo = await Todo.findOne({ _id: req.params.id })
    return res.send(todo);
})
router.delete('/:id', async (req, res) => {
    let todo = await Todo.findOneAndRemove({ _id: req.params.id })

    return res.send(todo);
})
export default router