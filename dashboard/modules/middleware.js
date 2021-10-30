module.exports = {
    // Check if the user is logged in
    isLoggedIn (req, res, next) {
        // Check if user is authenticated
        if(!req.isAuthenticated()) return res.redirect('/login');
        next()
    },

    //  Finds the guild by id
    findGuildId (req, res, next) {
        // Find the guild object
        const guild = req.user.guilds.find(g => g.id === req.params.id);
        // Throw 404 if object doesn't exist
        if(!guild) return res.render('404', {user: req.user});
        
        req.guild = guild;
        next()
    }
}