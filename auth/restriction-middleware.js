module.exports = (req, res, next) => {

    try {

            // if a session exists and the session has a user proceed
        if ( req.session && req.session.user) {
            next();
        }
        else 
            res.status(401).json( { message: "Invalid Credentials" } );
    } catch (error) { res.status(500).json( { message: 'Something wrong' } ) }

}