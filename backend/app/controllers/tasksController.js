var mongoose = require('mongoose'),
    Task = mongoose.model('tasks');
    mongoose.set('useFindAndModify', false);

exports.getAllTasks = function(req, res){ 
    //let user_uniq_id = req.params.userId;
    var token = req.headers.authorization.replace('Bearer ', '');
    //console.log(token, JSON.parse(atob(token.split('.')[1])));
    var decoded = jwtDecode(token);
    console.log(decoded.userId);
    const sortBy = req.query["sort-by"];
    console.log(sortBy);
    let user_uniq_id = decoded.userId;
    
    Task.find({user_id: new mongoose.Types.ObjectId(user_uniq_id)})
    .sort(sortBy).exec(function(err, result){
        if (err) 
            res.status(500).send({'error':'An error has occurred'});
        else
            res.status(200).send(result);
    });
}

exports.getUnfinished = function(req, res){
    //let user_uniq_id = req.params.userId;
    var token = req.headers.authorization.replace('Bearer ', '');
    var decoded = jwtDecode(token);
    let user_uniq_id = decoded.userId;
    Task.find({user_id: new mongoose.Types.ObjectId(user_uniq_id), isMade: false})
    .exec(function(err, result){
        if (err) 
            res.status(500).send({'error':'An error has occurred'});
        else
            res.status(200).send(result);
    });
}

exports.getTaskById = function(req, res){

    Task.findById(req.params.id, function(err, task) {
        if (err) {
            res.status(500).send({'error':'An error has occurred'});
        } else {
            res.status(200).send(task);
        }
     });
}

exports.createTask = function(req, res){
    let json = JSON.stringify(req.body);
    let data = JSON.parse(json);
    //const note = createNewObj(req);
    const note = { 
        name: data.name, 
        deadline: data.deadline, 
        details: data.details, 
        isMade: data.isMade, 
        user_id: data.user_id,
    };

    var new_task = new Task(note);
        new_task.save(function(err, task) {
        if (err) 
          res.status(500).send({ 'error': 'An error has occurred' }); 
         else 
          res.status(201);
    });
}
    
exports.updateTask = function(req, res){

    Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, task) {
        if (err) {
            res.status(500).send({'error':'An error has occurred'});
        } else {
            res.status(200).send(task);
        } 
    }, false);
}

exports.changeTaskStatus = function(req, res){
    const statusBool = req.params.statusBool;

    req.body.isMade = statusBool;

    Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, task) {
        if (err) {
            res.status(500).send({'error':'An error has occurred'});
        } else {
            res.status(200).send(task);
        } 
    });
}   

exports.deleteTask = function(req, res){
    Task.deleteOne({_id: req.params.id}, function(err, task) {
        if (err) {
        res.status(500).send({'error':'An error has occurred'});
        } else {
        res.status(201);
        } 
    }, false);
}