const {
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType
} = require('graphql');

const MessageType = new GraphQLObjectType({
    name: 'MessageType',
    description: 'Return messages',
    fields: {
        message: { type: GraphQLString },
        token: { type: GraphQLString }
    }
});

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'User list',
    fields: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    }
});

const UserRegType = new GraphQLInputObjectType({
    name: 'UseAddType',
    description: 'User add to list',
    fields: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    }
});

const FlightType = new GraphQLObjectType({
    name: 'FlightType',
    description: 'Flight list',
    fields: {
        _id: { type: GraphQLString },
        destination: { type: GraphQLString },
        date: { type: GraphQLString },
        file: { type: GraphQLString },
        price: {type: GraphQLInt }
    }
});

const FlightCreateType = new GraphQLInputObjectType({
   name: 'FlightCreateType',
   description: 'Add flight to the list',
   type: FlightType,
   fields: {
        destination: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        file: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLInt) }
   }
});

const FlightDeleteType = new GraphQLInputObjectType({
    name: 'FlightDeleteType',
    description: 'Delete flight from the list',
    type: FlightType,
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLString) }
    }
});

const FlightUpdateType = new GraphQLInputObjectType({
    name: 'FlightUpdateType',
    description: 'Update flight from the list',
    type: FlightType,
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        destination: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        file: { type: new GraphQLNonNull(GraphQLString) },
        price: {type: new GraphQLNonNull(GraphQLInt) }
    }
});

module.exports = { FlightType, FlightCreateType, FlightDeleteType, FlightUpdateType, UserType, UserRegType, MessageType };
