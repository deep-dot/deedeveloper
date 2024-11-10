const sendToken = (user, statusCode, res, type, sessionID) => {
  const token = user.getJWTToken(type);

//  console.log('Token type in jwtToken.js:', typeof token); // Should output 'string'

  const expirationTime = type === 'auth'
    ? parseInt(process.env.JWT_EXPIRE, 10) * 60 * 1000 // Auth token expiration in milliseconds
    : parseInt(process.env.EMAIL_VERIFICATION_EXPIRE, 10) * 60 * 1000; // Email verification token expiration in milliseconds

  const options = {
    expires: new Date(Date.now() + expirationTime),
    httpOnly: true,  // Make the session cookie HttpOnly
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
  };

  const tokenOptions = {
    expires: new Date(Date.now() + expirationTime),
    httpOnly: false, // The token cookie should not be HttpOnly if you need to access it from client-side scripts
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('connect.sid', sessionID, options);
  res.cookie('token', token, tokenOptions);

  return {
    token,
    tokenExpires: new Date(Date.now() + expirationTime),
  };
};

module.exports = sendToken;
