const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();
const app = express();

//connnecting to db


mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to DB!")
    })
    .catch((err) => {
        console.log("err");
    });

app.listen(3000, () => console.log("Server Up and running"));

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//view engine configuration
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD
app.post('/', async (req, res) => {
    console.log(req.body);
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        console.log(await todoTask.save());
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
        console.log('err');
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });