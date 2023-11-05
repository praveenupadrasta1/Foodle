const express = require('express');
const adminAppInit = require('../../../utils/firebase_utils/admin-init-app');
const router = express.Router();
const authenticateMiddleware = require('../../../middlewares/token-auth-middleware');

const admin = adminAppInit.getInstance();

router.post('/verify_token/', authenticateMiddleware, function(req, res){
    res.status(200).send({'msg':'Authenticated User!',
                            'user': req.user});
});

router.post('/session_token/', function(req, res){
      // Get ID token and CSRF token.
      console.log(req.body);
      console.log(req.cookies);
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();
  
  // Guard against CSRF attacks.
  if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }
  // Set session expiration to 5 days.
  
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // We could also choose to enforce that the ID token auth_time is recent.
  admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
    // In this case, we are enforcing that the user signed in in the last 5 minutes.
    console.log(new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60);
    if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
      return admin.auth().createSessionCookie(idToken, {expiresIn: expiresIn});
    }
    throw new Error('UNAUTHORIZED REQUEST!');
  })
  .then(function(sessionCookie) {
    // Note httpOnly cookie will not be accessible from javascript.
    // secure flag should be set to true in production.
    const options = {maxAge: expiresIn, httpOnly: true, secure: true /** to test in localhost */};
    res.cookie('session', sessionCookie, options);
    return res.end(JSON.stringify({status: 'success'}));
  })
  .catch(function(error) {
    return res.status(401).send({'error':'UNAUTHORIZED REQUEST!'});
  });
});

module.exports = router;