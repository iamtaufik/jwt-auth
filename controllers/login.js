const jwt = require('jsonwebtoken');
const bcryt = require('bcrypt');
const User = require('../model/user');
const throwErr = require('../helpers/throwErr');

async function authUser(req, res, next) {
  // function errupt(){
  //   return next( Error('Username and password required',{
  //     cause:{
  //       message:'Username and Password required',
  //       status:400
  // }

  if (!req.body.username || !req.body.password) {
    return throwErr('Username and Password required', 400, next);
    // return res.status(400).json({ invalid: 'Username and password required' });
  }

  const username = req?.body?.username;

  const founduser = await User.findOne({ username }).exec();

  if (!founduser) {
    return throwErr('Invalid Username', 401, next);
  }

  const validatePassword = await bcryt.compare(req.body.password, founduser?.password || '');

  if (!validatePassword) {
    return throwErr('Invalid Password', 401, next);
  }

  req.body.password = ';)';
  const accessToken = jwt.sign(
    {
      user: {
        id: founduser._id,
        username: founduser.username,
        verified: founduser.verified,
      },
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '1hr',
    }
  );

  const refreshToken = jwt.sign(
    {
      user: {
        id: founduser._id,
        username: founduser.username,
        verified: founduser.verified,
      },
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '1day',
    }
  );

  founduser.refreshToken = refreshToken;
  founduser.save();

  // res.cookie('refresh', refreshToken, {
  //   // httpOnly: false,
  //   sameSite: 'none',
  //   secure,
  //   expiresIn: 60 * 60 * 1000,
  // });

  const time = 60 * 60 * 1000;
  const cookie = `${refreshToken}; samesite=none; secure; expiresin=${time}`;

  res.setHeader('set-cookie', [cookie]);

  res.status(200).json({ token: accessToken });
}

module.exports = authUser;
