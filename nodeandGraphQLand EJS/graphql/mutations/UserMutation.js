const GraphQL = require('graphql');
const validator = require('validator');
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

const UserType = require('../types/UserType');
const UserResolver = require('../resolvers/UserResolver');

module.exports = {
    checkin() {
        return {
            types: UserType,
            description: 'allow user to login',
            args: {
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'email Id cannot be null',
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'password feild',
                }
            },
            resolve(parent, fields) {
                return UserResolver.auth(fields);
            }
        }
    },

    create() {
        return {
            type: UserType,
            description: 'add user',
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'enter the user name',
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'enter the user email',
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'enter the user password',
                }
            },
            resolve(parent, fields) {
                if (!fields.email) {
                    throw new Error('invalid email');
                }
                if (!validator.isLength(fields.password, { min: 6, max: undefined })) {
                    throw new Error('password length should be greate');
                }
                return UserResolver.create(fields);
            }
        }
    },
    update() {
        return {
            type: UserType,
            description: 'update the existing user',
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'enter the user name',
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'enter the user email',
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'enter the user password',
                }
            },
            resolve(parent, fields, context, info) {
                if (!fields.email) {
                    throw new Error('invalid email');
                }
                if (!validator.isLength(fields.password, { min: 6, max: undefined })) {
                    throw new Error('password length should be greate');
                }
                return UserResolver.update(context.user, fields);
            }
        }
    }

}
