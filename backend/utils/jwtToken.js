
const sendToken = (user, statusCode, res) => {

  const token = user.getJWTToken();

  const expirationTime = process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000; // Convert days to milliseconds

  const options = {
    expires: new Date(Date.now() + expirationTime),
    httpOnly: true, // Accessible only by web server
    sameSite: 'Lax', // CSRF protection
    secure: process.env.NODE_ENV != 'development' // Use HTTPS
  };

  res.cookie('token', token, options);

  return {
    token,
    tokenExpires: options.expires
  };
};

module.exports = sendToken;
