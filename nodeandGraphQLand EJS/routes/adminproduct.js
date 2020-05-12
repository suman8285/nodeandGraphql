var express = require("express");
var router = express.Router();

var Product = require('../models/product');
var Category = require('../models/category')
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');


router.get('/', (req, res, next)=> {
    debugger
    var count;
    Product.countDocuments(function(err,countVal){
            count = countVal;
    });
    Product.find({}).sort({ sorting: 1 }).exec(function (err, products) {
      res.render('admin/products', {
        products: Array.isArray(products)?products:[prducts]
      });
    });
  });

  //GET Page
router.get('/add-product',function(req,res){
  var title = "";
  var desc = "";
  var price = ""

  Category.find({}, function (err, categories) {
    res.render('admin/add_product', {
      title: title,
      desc: desc,
      price: price,
      categories: categories
    });
  });
});
/*
* POST CALL TO ADD PAGE
*/

/*
* POST add page
*/
router.post('/add-product', function (req, res, next) {

  var imageFile = typeof req.files.image !== "undefined"? req.files.image.name : "";
console.log('the file name is :-'+imageFile);
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('desc', 'descrpition must have a value').notEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    req.checkBody('image', 'You must upload the image').isImage(imageFile);
  
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
  
    var errors = req.validationErrors();
  
    if (errors) {
      Category.find({}, function (err, categories) {
        res.render('admin/add_product', {
          errors: errors,
          title: title,
          desc: desc,
          price: price,
          categories: categories
        });
      });
    } else {
        debugger
        Product.findOne({ slug: slug }, function (err, product) {
        if (product) {
          req.flash('danger', 'product title exists, choose another');
          res.render('admin/add_product', {
            title: title,
            desc: desc,
            price: price,
            categories: categories
          });
        } else {
          var price2 = parseFloat(price).toFixed(2);
        var product = new Product({
          title: title,
          slug: slug,
          desc: desc,
          price: price2,
          category: category,
          image: imageFile
        });
          product.save(function (err) {
            if (err) {
              return console.log(err);
            }

            mkdirp('public/product-images/' + product._id, function (err) {
              return console.log();
            });
            mkdirp('public/product-images/' + product._id + '/gallery', function (err) {
              return console.log();
            });
            mkdirp('public/product-images/' + product._id + '/gallery/thumbs', function (err) {
              return console.log();
            });
  
            if (imageFile != '') {
              var productImage = req.files.image;
              var path = 'public/product-images/' + product._id + '/' + imageFile;
  
              productImage.mv(path, function (err) {
                return console.log(err);
              });
            }


            Product.find({}).sort({ sorting: 1 }).exec(function (err, products) {
               // console.log('pages :-'+pages);
              if (err) {
                console.log(err);
              } else {
                req.app.locals.products = products;
              }
            });
            req.flash('success', 'product added');
            res.redirect('/admin/products');
          });
        }
      });
    }
  
  });

 /*
* GET edit product
*/
router.get('/edit-product/:id', function (req, res, next) {

  var errors;

  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Category.find(function (err, categories) {

    Product.findById(req.params.id, function (err, product) {
      if (err) {
        console.log(err);
        res.redirect('/admin/products');
      } else {
        var galleryDir = 'public/product-images/' + product._id + '/gallery';
        var galleryImages = null;

        fs.readdir(galleryDir, function (err, files) {
          if (err) {
            console.log(err);
          } else {
            galleryImages = files;

            res.render('admin/edit_product', {
              errors: errors,
              title: product.title,
              desc: product.desc,
              price: parseFloat(product.price).toFixed(2),
              categories: categories,
              category: product.category.replace(/\s+/g, '-').toLowerCase(),
              image: product.image,
              galleryImages: galleryImages,
              id: product._id
            });
          }
        });
      }
    });

  });

});

/*
* POST edit product
*/
router.post('/edit-product/:id', function (req, res, next) {

  var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Descrtiption must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();
  req.checkBody('image', 'You must upload an image').isImage(imageFile);

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  var pimage = req.body.pimage;
  var id = req.params.id;

  console.log(pimage);

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect('/admin/products/edit-product/' + id);
  } else {
    Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, prod) {
      if (err)
        console.log(err);
      if (prod) {
        req.flash('danger', 'Product title already exists, please choose another');
        res.redirect('/admin/products/edit-product/' + id);
      } else {
        Product.findById(id, function (err, prod) {
          if (err)
            console.log(err);

          prod.title = title;
          prod.slug = slug;
          prod.desc = desc;
          prod.price = parseFloat(price).toFixed(2);
          prod.category = category;
          if (imageFile != '') {
            prod.image = imageFile;
          }

          prod.save(function (err) {
            if (err)
              console.log(err);
            if (imageFile != '') {
              if (pimage != '') {
                fs.remove('public/product-images/' + id + '/' + pimage).then(() => {
                  console.log('success!')
                })
                  .catch(err => {
                    console.error(err)
                  })
              }

              var productImage = req.files.image;
              var path = 'public/product-images/' + id + '/' + imageFile;

              productImage.mv(path, function (err) {
                return console.log(err);
              });
            }

            req.flash('success', 'Product edited!');
            res.redirect('/admin/products');
          });

        });
      }

    });
  }
});


/*
/* POST product gallery page
*/
router.post('/product-gallery/:id', function (req, res, next) {
  var productImage = req.files.file;
  var id = req.params.id;
  var path = 'public/product-images/' + id + '/gallery/' + req.files.file.name;
  var thumbsPath = 'public/product-images/' + id + '/gallery/thumbs/' + req.files.file.name;

  productImage.mv(path, function (err) {
    if (err)
      console.log(err);

    resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
      fs.writeFileSync(thumbsPath, buf);
    });
  });

  res.status(200).send('OK');
});

 /*
/* GET delete image
*/
router.get('/delete-image/:image', function (req, res, next) {
  var originalImage = 'public/product-images/' + req.query.id + '/gallery/' + req.params.image;
  var originalThumb = 'public/product-images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

  fs.remove(originalImage, function (err) {
    if (err) {
      console.log(err);
    } else {
      fs.remove(originalThumb, function (err) {
        if (err) {
          console.log(err);
        } else {
          req.flash('success', 'Image deleted!');
          res.redirect('/admin/products/edit-product/' + req.query.id);
        }
      });
    }
  });
});


/*
/* GET delete product
*/
router.get('/delete-product/:id', function (req, res, next) {

  var id = req.params.id;
  var path = 'public/product-images/' + id;

  fs.remove(path, function (err) {
    if (err) {
      console.log(err);
    } else {
      Product.findByIdAndRemove(id, function (err) {
        console.log(err);
      });

      req.flash('success', 'Product deleted!');
      res.redirect('/admin/products');
    }
  });
});


//exports
module.exports = router