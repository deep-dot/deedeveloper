const sendToken = (user, statusCode, res, type) => {
  const token = user.getJWTToken(type);

  const expirationTime = type === 'auth'
    ? parseInt(process.env.JWT_EXPIRE, 10) * 60 * 1000 // Auth token expiration in milliseconds
    : parseInt(process.env.EMAIL_VERIFICATION_EXPIRE, 10) * 60 * 1000; // Email verification token expiration in milliseconds

    console.log( 'expiration time==', expirationTime);
  const options = {
    expires: new Date(Date.now() + expirationTime),
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
  };

  res.cookie('token', token, options);

  // return token;
  return {
    token,
    tokenExpires: new Date(Date.now() + expirationTime),
  };
};

module.exports = sendToken ;
