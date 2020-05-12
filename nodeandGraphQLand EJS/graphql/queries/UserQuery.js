const GraphQL = require('graphql');

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

const UserType = require('../types/UserType');
const UserResolver = require('../resolvers/UserResolver');

module.exports = {
    // index() {
    //     return {
    //         type: new GraphQLList(UserType),
    //         description: 'return all user',
    //         resolve: (parent, args, context, info) {
    //             return UserResolver.index({});
    //         }
    //     }
    // },

    single() {
        return {
            type: UserType,
            description: 'return matched single user',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: ' enter the search id'
                }
            },
            resolve(parent, args, context, info) {
                return UserResolver.single({ id: args.id });
            }
        }
    }
}