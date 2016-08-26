var express=require('express');
var bodyParser=require('body-parser');
var _ = require('underscore');

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
    var foundID=_.findWhere(todos, { id: todoID});
    
    if (foundID) {
        res.json(foundID);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res) {
    var body=req.body;

    var body=_.pick(body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description)|| body.description.trim().length===0) {
        return res.status(400).send();
    }
    
    var todo = {
        id: todoNextID,
        description: body.description.trim(),
        completed: body.completed
    };
    todos.push(todo)

    todoNextID++;
    res.json(todos);
});
app.delete('/todos/:id', function (req, res) {
    //res.send("ask for todos of id: "+req.params.id);
    var todoID=parseInt(req.params.id, 10);
    var foundID=_.findWhere(todos, { id: todoID});
    
    if (foundID) {
        todos=_.without(todos, foundID)
        res.json(foundID);
    } else {
        res.status(404).send();
    }
});
app.listen(PORT, function() {
    console.log('Express listening on port '+PORT);

});