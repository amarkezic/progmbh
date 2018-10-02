import db from "../utils/db";

let todoSchema = new db.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    date: Date,
    finished: {
        type: Boolean,
        default: false
    }
},{
    collection: "todos"
});

let Todo = db.model('Todo', todoSchema);

export {Todo}