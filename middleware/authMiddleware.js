const protect = (req, res, next) => {
    const {user} = req.session;

    /*
        If the user is not logged in we return an error and the
        next middleware or controller is NOT called. 
    */
    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        })
    }

    /*
        We can assign the user info directly to the request so that
        we no longer have to go to req.session.
    */
    req.user = user;

    /*
        When we call the next method we move on to the controller
        of the next middleware in the stack
    */
    next();
}

module.exports = protect;