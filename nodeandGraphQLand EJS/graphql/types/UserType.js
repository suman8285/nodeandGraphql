const GraphQL = require('graphql');

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = GraphQL;

const Common = require('./common');

const UserType = new GraphQL.GraphQLObjectType({
    name: 'User',
    description: 'type user for storing user details',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'id of the user',
        },
        name: {
            type: GraphQLString,
            description: 'user name',
        },
        email: {
            type: GraphQLString,
            description: 'user email',
        },
        activestatus: {
            type: GraphQLBoolean,
            description: 'to determine if user is active or not',
        },
        authtoken: {
            type: GraphQLString,
            description: 'user token',
        },
        created: {
            type: GraphQLString,
            description: 'user email',
        },
        updated: {
            type: GraphQLString,
            description: 'user email',
        }
    })
});

module.exports = UserType;