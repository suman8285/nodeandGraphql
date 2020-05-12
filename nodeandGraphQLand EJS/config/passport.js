const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const user = require('../models/user');


// to authentcate the user by JWT stategry
module.exports = (userType, passport) => {
    var opts = {};
    console.log('before getting the token');
    // if (req.headers.authorization) {
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('x-token');//fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'suman';

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('payload received', jwt_payload);
        let name = jwt_payload.data.name
        console.log("name is " + name);
        return done(null, name);
    }));
    //   }
}