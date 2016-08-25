var express=require('express');
var bodyParser=require('body-parser');
var app=express();

var PORT = process.env.PORT || 3000;

var todoNextID=1
var todos = [];

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Request');
});

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    //res.send("ask for todos of id: "+req.params.id);
    var todoID=parseInt(req.params.id, 10);
    var foundID;
    todos.forEach(function (todo) {
        if (todo.id===todoID) {
            foundID=todo;
        }
    });
    if (foundID) {
        res.json(foundID);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res) {
    var body=req.body;
    
    var todo = {
        id: todoNextID,
        description: body.description,
        completed: body.completed
    };
    todos.push(todo)

    todoNextID++;
    res.json(todos);
});

app.listen(PORT, function() {
    console.log('Express listening on port '+PORT);

});