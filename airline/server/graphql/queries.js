const { GraphQLList, GraphQLObjectType } = require('graphql');

const { FlightType, UserType } = require('./types');
let Flight = require('../Model/flight');
let User = require('../Model/user');

const MainQueryType = new GraphQLObjectType({
    name: 'MainQueryType',
    description: 'Query Schema for MainType',
    fields: {
        flights: {
            type: new GraphQLList(FlightType),
            resolve: () => {
                return getFlights()
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User
        }
    }
});

async function getFlights() {
    let array = []
    await Flight.find()
        .then((result) => {
            array = result
        })
    return array
}

module.exports = MainQueryType;
