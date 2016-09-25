var express=require('express');
var bodyParser=require('body-parser');
var _ = require('underscore');
var db=require('./db.js');
var bcrypt = require('bcryptjs');
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
    });
  });
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
});
app.delete('/todos/:id', function (req, res) {
    //res.send("ask for todos of id: "+req.params.id);
    var todoID=parseInt(req.params.id, 10);
    db.todo.destroy({where: {id: todoID}})
    .then(function(noRows) {
      if (noRows>0) {
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    }).error(function() {
      res.status(500).send();
    });
});
app.put('/todos/:id', function (req, res) {
    var body=_.pick(req.body, 'description', 'completed');
    var todoID=parseInt(req.params.id, 10);
      var Attributes={};

    if (body.hasOwnProperty('completed'))  {
        Attributes.completed=body.completed;
    }
    if (body.hasOwnProperty('description'))  {
        Attributes.description=body.description;
    }
db.todo.findById(todoID).then(function(todo) {
  if (todo) {
    todo.update(Attributes).then(function(todo) {
      res.json(todo.toJSON());
    }, function(e) {
      res.status(400).json(e);
    });
  } else {
    res.status(404).send();
  }
  }, function() {
    res.status(500).send();
})
});
app.post('/users', function(req, res) {
    var body=req.body;

    var body=_.pick(body, 'email', 'password');

    db.user.create(body).then(function(user) {
      res.json(user.toPublicJSON());
    }).error(function(e) {
      res.status(400).json(e);
    });
});
app.post('/users/login', function(req, res) {
  var body=req.body;
  var body=_.pick(body, 'email', 'password');

  db.user.authenticate(body).then(function(user) {
    res.json(user.toPublicJSON());
  }, function() {
    res.status(401).send();
  });
});

db.sequelize.sync(force: true).then(function() {
  app.listen(PORT, function() {
      console.log('Express listening on port '+PORT);

  });
});
