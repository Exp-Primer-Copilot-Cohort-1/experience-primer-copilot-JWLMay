// Create web server
// Date: 02/09/2015
// By: Arius

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');
var auth = require('../middlewares/auth');

// /comments
router.get('/', function(req, res) {
  Comment.find({}, function(err, comments) {
    res.json(comments);
  });
});

// /comments/:id
router.get('/:id', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    res.json(comment);
  });
});

// /comments/new
router.get('/new', auth.isLoggedIn, function(req, res) {
  res.render('comments/new');
});

// /comments
router.post('/', auth.isLoggedIn, function(req, res) {
  var comment = new Comment(req.body);
  comment.save(function(err, comment) {
    if (err) {
      return res.json(err);
    } else {
      Post.findByIdAndUpdate(req.body.post_id, {
        $push: {
          comments: comment._id
        }
      }, function(err, post) {
        if (err) {
          return res.json(err);
        } else {
          User.findByIdAndUpdate(req.body.user_id, {
            $push: {
              comments: comment._id
            }
          }, function(err, user) {
            if (err) {
              return res.json(err);
            } else {
              res.redirect('/posts/' + req.body.post_id);
            }
          });
        }
      });
    }
  });
});

// /comments/:id/edit
router.get('/:id/edit', auth.isLoggedIn, function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return res.json(err);
    } else {
      res.render('comments/edit', {
        comment: comment
      });
    }
  });
});

// /comments/:id
router.put('/:id', auth.isLoggedIn, function(req, res) {
  Comment.findByIdAndUpdate(req.params.id, req.body, function(err, comment) {
    if (err) {
      return res.json(err);
    } else {
      res.redirect('/posts/' + comment.post_id);
    }
  });
});

// /comments/:id/delete
router.delete('/:id', auth.isLoggedIn, function(req, res) {
  Comment.findByIdAndRemove(req.params.id, function(err