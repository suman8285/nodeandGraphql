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

exports.intialOutputType = new GraphQLInputObjectType({
    name: 'intialOutput',
    description: 'intializing response structure',
    fields: () => ({
        applicationVersion: {
            type: GraphQLString,
            description: 'return application version'
        },
    })
});