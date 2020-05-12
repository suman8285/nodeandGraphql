const GraphQL = require('graphql');
const common = require('../types/common');

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = GraphQL;

const IntializeResolver = require('../resolvers/InitializeResolver');

module.exports = {
    index() {
        return {
            type: common.intialOutputType,
            description: 'intializing data',
            resolve(parent, args, context, info) {
                return IntializeResolver.index({});
            }
        }
    }
};