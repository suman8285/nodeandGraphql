const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLSchema,
} = GraphQL;

const UserQuery = require('./queries/UserQuery');

const UserMutation = require('./mutations/UserMutation');
const InitQuery = require('./queries/intializeQuery');


// define the root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'default by backend',
    fields: {
        init: InitQuery.index(),
        // users
        users: UserQuery.single()
    },
});

// define root mutation
const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'default by backend',
    fields: {
        adduser: UserMutation.create(),
        updateUser: UserMutation.update()
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});