import mongoose from "mongoose";
import config from "config";

const dbConfig = config.get("dbConfig")
mongoose.connect("mongodb://" + dbConfig.host + ":" + dbConfig.port, {
    useNewUrlParser: true, dbName: "todo"
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("connected to db");
});
export default mongoose