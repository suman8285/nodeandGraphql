// Global imports
/*
  var declarations are globally scoped or function scoped 
  let and const are block scoped. 
  var variables can be updated and re-declared within its scope; 
  let variables can be updated but not re-declared; 
  const variables can neither be updated nor re-declared

*/
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const log4js = require('log4js');
var logger = log4js.getLogger();
const dotenv = require('dotenv');
const expressGraphQl = require('express-graphql');


module.exports = logger;

//local imports
const config = require('./config/database');
const swaggerdocument = require('./config/swaggerConfig');
const GraphQlSchema = require('./graphql');

// for Swagger related
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
var passport = require('passport');

// init app
const app = express();

//Cors setup
app.use(cors());

// Create a custom middleware function
const checkUserType = function (req, res, next) {
  const userType = req.originalUrl.split('/')[2];
  // Bring in the passport authentication starategy
  require('./config/passport')(req, passport);
  next();
};

app.use(checkUserType);

// connect to DB
mongoose.connect(config.database)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  logger.debug('connected to database' + process.env.SUMAN);
  console.log('connected to database')
});

// options for the swagger docs
var options = {
  swaggerDefinition: swaggerdocument,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger as json
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// serve swagger as UI
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec, {
  explorer: true
})
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs-locals'));

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// set global errors variable
app.locals.errors = null;

// get Page model
const Page = require('./models/page');

// get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
  if (err) {
    console.log(err);
  } else {
    app.locals.pages = pages;
  }
});

// get Category model
const Category = require('./models/category');
// get all categories to pass to header.ejs
Category.find({}, function (err, categories) {
  if (err) {
    console.log(err);
  } else {
    app.locals.categories = categories;
  }
});

// file upload middleware
app.use(fileUpload());

//Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

// express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// express validator middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: (value, filename) => {
      var extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}));

// express message middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// set cart locals
app.get('*', (req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});

//start the server
var port = 3000;
app.listen(port, () => {
  console.log('server started on port' + port);
});

app.get('*', (req, res, next) => {
  res.locals.cart = req.session.cart;
  next();
});

// set routes

var pages = require('./routes/pages');
app.use('/', pages);

var adminPages = require('./routes/adminpage');
app.use('/admin/pages', adminPages);

var adminCategories = require('./routes/admincategory');
app.use('/admin/categories', adminCategories);

var adminproducts = require('./routes/adminproduct');
app.use('/admin/products', adminproducts);

var products = require('./routes/products');
app.use('/products', products);

var cart = require('./routes/cart');
app.use('/cart', cart);

var apijs = require('./routes/apijoiexample');
app.use('/apis', apijs);

var feignexample = require('./routes/feignexample');
app.use('/feign', feignexample);

var routeexample = require('./routes/routingExample');
app.use('/routetry', routeexample);

var httpresumefileupload = require('./routes/resumeablefileupoad');
app.use('/resupload', httpresumefileupload);

var sendEmail = require('./routes/sendEmail');
app.use('/email', sendEmail);

var user = require('./routes/user');
app.use('/user', user);

// ************************** GRAPHQL starts HERE *************************
app.use('/graphql', expressGraphQl(req => ({
  schema: GraphQlSchema,
  graphiql: process.env.ENVIRONMENT === 'development',
})
));