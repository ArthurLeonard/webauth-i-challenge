
const express = require('express'); // get express package
const helmet = require('helmet');   // get helmet for security layer
const cors = require('cors');       // get cors for what??
const bcrypt = require('bcryptjs'); // bcrypt will hash our passwords
const session = require('express-session');

//const db = require('./data/dbConfig.js');
const users = require('./users/user-functions.js');
const sessionConfig = require('./auth/session-config.js');
const restricted = require('./auth/restriction-middleware.js');

const server = express();           // initialize our server from express

    // use imported packages
server.use(helmet());
server.use(express.json());   // needed for json parsing
server.use(cors());
server.use(session(sessionConfig)); // Now we can use express-session configured with the configuration file

server.get('/', (req, res) => {
    res.send("Hi Mom!");
})


server.post('/api/register', (req, res) => {
    let user = req.body;    // grab whole body as user

        // replace pass word  with the hashed the password (2^10 times)
    user.password = bcrypt.hashSync(user.password, 10);

    users.addUser(user).then(saved => { res.status(201).json(saved) })
                        .catch(err => { res.status(500).json(error) });
}) // end post

server.post('/api/login', (req, res) => {
    let {username, password} = req.body; // destructured from body

            //look on database for matching user
    users.findUserBy( {username }).first().then( user => {  //if matching user found and passwords match
                                                      if ( user && bcrypt.compareSync(password, user.password)) {   
                                                            req.session.user = user;
                                                            res.status(200).json( { message: `Welcome ${user.username}`});
                                                      } else
                                                            res.status(401).json( { message: 'Invalid Credentials' })
                                            })
                                            .catch( err => { res.status(500).json(error) });
})

// function restrictAccess (req, res, next) {

//     const {username, password} = req.headers;  //getting from headers this time
//         // check to see that both are provided  
//     if ( username && password ) {
//         users.findUserBy( {username} ).first().then( user => {
//                                                                 if (user && bcrypt.compareSync(password, user.password))
//                                                                     next();
//                                                                 else 
//                                                                     res.status(401).json({ message: 'passswords do not match'})
//                                                })
//                                                .catch( error => { res.status(500).json(error)});     
//     }
//     else 
//         res.status(401).json( { message: 'You need to have a username and a passsword' } );
// } // end restrictAccess()


server.get('/api/users', restricted, (req, res) => {
    users.findUser().then( users => { res.json(users); })
                    .catch(err => res.send(err))

})



const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server up on port ${port}`));