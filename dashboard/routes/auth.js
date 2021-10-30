const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get('/login', passport.authenticate('discord'));

router.get('/auth', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/dash') // Successful auth
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;