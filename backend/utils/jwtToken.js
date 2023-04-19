// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {

  const token = user.getJWTToken();
  //console.log('token in jwtToken===', token);
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
     httpOnly: true,
     sameSite: 'Lax',
     secure: true
  };

  res.cookie('token',token, options);
  //res.status(200).send(`Token ${token} has been set in a cookie`);

  // res.status(statusCode).cookie("token", user.token, options).send({
  //   success: true,
  //   msg: `User registered successfully`,
  //    token,
  //   });    
};
module.exports = sendToken;
