const { GraphQLNonNull, GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');
const b_crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    UserRegType,
    FlightType,
    FlightCreateType,
    FlightDeleteType,
    FlightUpdateType,
    MessageType
} = require('./types');

const Flight = require('../Model/flight');
const User = require('../Model/user');

function auth(headers) {
    console.log(headers.authorization)
    if (headers.authorization){
        let token = headers.authorization;
        let user = jwt.verify(token, 'SECRET_KEY');
        console.log(user);
        if (user) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const MainMutationType = new GraphQLObjectType({
    name: 'MainMutationType',
    description: 'Mutations for MainType',
    fields: {
        createFlight: {
            type: FlightType,
            args: {
                input: { type: new GraphQLNonNull(FlightCreateType) }
            },

            resolve: (source, { input }, context) => {
                if (auth(context.user)) {
                    console.log(input)
                    const flight = new Flight(input);
                    console.log("FlighsdfsdfsdfsdsdfsdP: ")
                    console.log(flight)
                    flight.save()
                    return flight
                } else {
                    return null;
                }
            }
        },

        deleteFlight: {
            type: FlightType,
            args: {
                input: {type: new GraphQLNonNull(FlightDeleteType) }
            },
            resolve: async (source, { input }, context) => {
                let res = {}
                console.log(input);
                if (auth(context.user)) {
                    const id = input._id
                    await Flight.findByIdAndDelete(id);
                    res._id = id;
                } 
                console.log(res)
                return res;
            }
        },

        updateFlight: {
            type: FlightType,
            args: {
                input: {type: new GraphQLNonNull(FlightUpdateType) }
            },
            resolve: (source, { input }, context) => {
                if (auth(context.user)) {
                    const flightInstance = new Flight(input)
                    Flight.findByIdAndUpdate(input._id, flightInstance)
                        .then((result) => console.log(result))
                        .catch((err) => console.log(err))
                    return flightInstance;
                } else {
                    return null;
                }
            }
        },

        registerUser: {
            type: MessageType,
            args: {
                input: {type: new GraphQLNonNull(UserRegType)}
            },
            resolve: async (source, { input }) =>{
                let res = {}
                console.log(input);
                const userInstance = new User(input)

                const salt = b_crypt.genSaltSync(10);
                const user = new User({
                    email: userInstance.email,
                    password: b_crypt.hashSync(userInstance.password, salt)
                })
            
                await User.find({ email: user.email }, function (err, docs) {
                    if (docs.length == 0) {
                        res.message = null
                        user.save()
                            .catch(() => {
                                res.message = "Already exists.";
                            });
                    } else {
                        res.message = "Already exists.";
                    }
                });
                return res;
            }
        },

        loginUser: {
            type: MessageType,
            args: {
                input: {type: new GraphQLNonNull(UserRegType)}
            },
            resolve: async (source, { input }) => {
                let res = {};
                const user = new User(input)

                await User.find({ email: user.email}, function (err, docs) {
                        if (docs.length == 0) {
                            console.log(docs);
                            res.message = "Not found";
                        } else {
                            const userFromDB = docs[0];
                            console.log(userFromDB);
                            const even = b_crypt.compareSync(user.password, userFromDB.password);
                            if (even) {
                                console.log("even");
                                const token = jwt.sign({
                                    email: userFromDB.email
                                }, "SECRET_KEY", { expiresIn: 60 * 60 });
                                res.token = token;
                            } else {
                                res.message = "Password doesn't match.";
                            }
                        }
                    })
                console.log(res)
                return res;
            }
        }
    }
});

module.exports = MainMutationType;
