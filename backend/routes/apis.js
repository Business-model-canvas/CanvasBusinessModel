var express = require('express');
var User = require('../models').User;
var router = express.Router();
const sendEmail = require("../libs/sendEmail")
const messages = require("../libs/messages")
const templates = require("../libs/templatesEmail");
const bcrypt = require("bcryptjs");
const passport = require('../passport');
const jwt = require("jsonwebtoken")

router.post('/registration', function(req, res){
    User.findOne({ "useremail": req.body.email })
    .then(user=> {
        if (!user) {
            const newUser = new User({
                    password: bcrypt.hashSync(req.body.password1, 10),
                    useremail: req.body.email,
                    username: req.body.username,
                    
                });
            newUser
                    .save()
                    .then(user=>sendEmail(user.useremail, templates.confirmed(user.id)))                    
                    .then(()=>res.json({msg:messages.confirm}))
                    .catch(err=>res.json(err));
        } else if (user && !user.confrim) {
                sendEmail(user.useremail, templates.confirmed(user.id))
                .then(()=>res.json({msg: messages.resend}))
                .catch(err=>res.json(err))
        } else {
                return res.status(400).json({email: "Email already exists"});
        }
    })
    .catch(err=> res.json(err))
});
router.post("/register/confirm/:id", (req,res)=>{
    const {id} = req.params;

    User.findById(id)
    .then(user => {
      // A user with that id does not exist in the DB. Perhaps some tricky 
      // user tried to go to a different url than the one provided in the 
      // confirmation email.
      if (!user) {
        res.json({ msg: messages.couldNotFind })
      }
      
      // The user exists but has not been confirmed. We need to confirm this 
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {

          User.update({
                confirm: true
            },{ 
                where: { id: id } 
            }).then(result => {
                res.status(200).json({msg: messages.confirmed});
            })
          .catch(err => console.log(err))
      }

      // The user has already confirmed this email address.
      else  {
        res.json({ msg: msgs.alreadyConfirmed })
      }

    })
    .catch(err => console.log(err))
})

router.post(
    "/login",
    (req, res, next) =>{


        passport.authenticate("local", function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                res.status(400).json(info)
             }
            
            const cleanUser = Object.assign({}, user.dataValues)
            console.log("user", user, "cleanUser", cleanUser)
            if (cleanUser.password) {
                delete cleanUser.password
            }
            const payload = cleanUser

                jwt.sign(
                    payload,
                    "secret",
                    (err,token)=>{
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    });
        })(req,res,next)
})
// router.get('/:id', function(req, res){
//     console.log('getting one book');
//     Book.findById(req.params.id).then(book => {
//         console.log(book);
//         res.json(book);
//     });
    /* another ways to do it
    Book.findOne({ where: {id: req.params.id} }).success(book => {
        console.log(book);
        res.json(book);
    }).error(err => {
        res.send('error has occured');
    });
    */
// });

// router.put('/:id', function(req, res){
//     Book.update({
//         title: req.body.title,
//         author: req.body.author,
//         category: req.body.category
//     },{ 
//         where: { id: req.params.id } 
//     }).then(result => {
//         res.status(200).json(result);
//     });
// });

// router.delete('/:id', function(req, res){
//     Book.destroy({ 
//         where: { id: req.params.id } 
//     }).then(result => {
//         res.status(200).json(result);
//     });
// });

module.exports = router;