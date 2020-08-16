var express = require('express');
var userModel = require.main.require('./models/user');
var router = express.Router();

router.get('*', function(req, res, next){
	if(req.session.username == null){
		res.redirect('/login');
	}else{
		next();
	}
});


router.get('/', function(req, res) {
    res.render('home/index' ,{username: req.session.username});
});

router.get('/signup', function(req, res) {
    res.render('signup/index');
});


router.post('/signup', function(req, res) {

    var user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        type: req.body.type
    }

    userModel.insert(user, function(status) {
        if (status) {
            res.redirect('/login');
        } else {
            res.redirect('/signup');
        }
    });
});


router.get('/userlist', function(req, res) {

    userModel.getAll(function(results) {
        res.render('home/userlist', { userList: results, username: req.session.username });
    });
});


router.get('/adduser', function(req, res) {
    res.render('home/adduser');
});


router.post('/adduser', function(req, res) {

    var user = {
        empNo     : req.body.empNo,
        contactNo : req.body.password,
        username  : req.body.username,
        password  : req.body.password
    }

    userModel.insert(user, function(status) {
        if (status) {
            res.redirect('/home/userlist');
        } else {
            res.redirect('/home/adduser');
        }
    });
});

router.get('/update/:id', function(req, res){

    userModel.get(req.params.id, function(result){
        res.render('home/update', {user: result});
    });

});

router.post('/update/:username', function(req, res){

  var user = {

    id               :req.params.id,
    username         :req.body.username,
    password         :req.body.password,
    email            :req.body.email,
    type             :req.body.type,


    }

    userModel.update(user, function(status){
        if(status){
            res.redirect('/user/view_users');
        }else{
            res.redirect('/user/editProfile/'+req.params.id);
        }
    });
});

router.get('/delete/:id', function(req, res) {

    userModel.get(req.params.id, function(result) {
        res.render('home/delete', { user: result });
    });

});

router.post('/delete/:id', function(req, res) {

    userModel.delete(req.body.id, function(status) {
        if (status) {
            res.redirect('/user/view_users');
        } else {
            res.redirect('/home');
        }
    });
});



module.exports = router;
