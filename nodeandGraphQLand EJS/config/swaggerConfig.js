

// swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Swagger for the shopping cart application',
        license: {
            name: "SUMAN",
            url: "http://google.com"
        },
        contact: {
            name: "Swagger",
            url: "https://swagger.io",
            email: "Info@SmartBear.com"
        }
    },
    servers: [
        {
            url: "http://localhost:3000"
        }
    ],
    "host": "localhost:3000",
    "basePath": "/",
    "swagger": "2.0",
    "paths": {},
    "definitions": {},
    "responses": {},
    "parameters": {},
    "securityDefinitions": {}
};

//exports
module.exports = swaggerDefinition;
