const passport = require('passport');  // authentication
const jwt = require('jsonwebtoken');
const {userColl}=require('../models/user');
const tokenSecret = 'mdb!@#123psd';

// API Save product
const register = async (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  userColl.create({username:req.body.username, password: req.body.password}).then((data) => {
      res.send(data)
  }).catch((err) => {
      res.send(err);
  })
}

const login = async(req, res, next) =>{
  try{
    let token = null;
  // Do email and password validation for the server
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) return next(authErr);
    console.log(user);
    if (!user) {
      console.log("UID:"+user.username)
      return res.sendStatus(401);
    }
    return req.logIn(user, (loginErr) => {
      if (loginErr) return res.sendStatus(401);
      console.log("UID token:"+user._id);
      token=jwt.sign({_id:user._id}, tokenSecret, { expiresIn: 86400 });
      return res.status(200).send({ auth: true, username: user.username, access_token: token});
    })
  })(req, res, next);
}catch(error){
  return res.status(500).send(error);
}
}

module.exports={
  register,
  login
}