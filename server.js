var express=require('express');
var bodyParser=require('body-parser');
var _ = require('underscore');
var db=require('./db.js');
var app=express();

var PORT = process.env.PORT || 3000;

var todoNextID=1
var todos = [];

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Request');
});

app.get('/todos', function (req, res) {
    var query = req.query;
    var where={};

    if (query.hasOwnProperty('completed') && query.completed==='true') {
      where.completed=true;
    } else if (query.hasOwnProperty('completed') && query.completed==='false') {
      where.completed=false;
    }
    if (query.hasOwnProperty('q') && query.q.length>0 ) {
      where.description={
        $like: '%'+query.q+'%'
      };
    }
    db.todo.findAll({where: where}).then(function(todos) {
      res.json(todos);
    }, function(e) {
      res.status(500).send();
    })
  });
//     var filteredTodos=todos;
//
//     if (qp.hasOwnProperty('completed') && (qp.completed === "true")) {
//         filteredTodos=_.where(filteredTodos, {completed: true});
//     } else {
//         if (qp.hasOwnProperty('completed') && (qp.completed === "false")) {
//             filteredTodos=_.where(filteredTodos, {completed: false});
//         } else {
//             filteredTodos=todos;
//         }
//     }
//     if (qp.hasOwnProperty("q") && qp.q.trim().length>0) {
//         filteredTodos=_.filter(filteredTodos, function(todo) {
//             return todo.description.toLowerCase().indexOf(qp.q.toLowerCase())>=0;
//         });
//     }
//
//     res.json(filteredTodos);
//
app.get('/todos/:id', function (req, res) {
    //res.send("ask for todos of id: "+req.params.id);
    var todoID=parseInt(req.params.id, 10);
    //
    db.todo.findById(todoID)
    .then(function(foundID) {
      if (!!foundID) {
        return res.json(foundID);
      } else {
        return res.status(404).send();
      }
    }).error( function(e) {
        return res.status(404).json(e);
    });
});

app.post('/todos', function(req, res) {
    var body=req.body;

    var body=_.pick(body, 'description', 'completed');

    db.todo.create({
      description: body.description.trim(),
      completed: body.completed
    }).then(function(todo) {
      return res.status(200).json(todo.toJSON());
    }).error(function(e) {
      return status(400).json(e);
    });
    // if (!_.isBoolean(body.completed) || !_.isString(body.description)|| body.description.trim().length===0) {
    //     return res.status(400).send();
    // }
    //
    // var todo = {
    //     id: todoNextID,
    //     description: body.description.trim(),
    //     completed: body.completed
    // };
    // todos.push(todo)
    //
    // todoNextID++;
    // res.json(todos);
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
app.put('/todos/:id', function (req, res) {
    var body=_.pick(req.body, 'description', 'completed');
    var todoID=parseInt(req.params.id, 10);
    var foundID=_.findWhere(todos, { id: todoID});

    if (!foundID) {
        res.status(404).send();
    }

    var validAttributes={};
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed=body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }
    if (body.hasOwnProperty('description') && _.isString(body.decription) && body.description.trim().length>0) {
        validAttributes.description=body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }
    _.extend(foundID, validAttributes);
    res.json(foundID);
});
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
      console.log('Express listening on port '+PORT);

  });
});
