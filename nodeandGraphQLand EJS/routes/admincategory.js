var express = require("express");
var router = express.Router();
var Category = require('../models/category')


router.get('/', function (req, res, next) {
    //res.send('test is working');
    Category.find({}).sort({ sorting: 1 }).exec(function (err, categories) {
       res.render('admin/categories', {
         categories: Array.isArray(categories)?categories:[categories]
       });
     });
  });

  //GET Page
router.get('/add-category',function(req,res){
    var title="";
    res.render('admin/add_category',{
         title: title
    });
})
/*
* POST CALL TO ADD PAGE
*/

/*
* POST add page
*/
router.post('/add-category', function (req, res, next) {

    req.checkBody('title', 'Title must have a value').notEmpty();
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var errors = req.validationErrors();
    if (errors) {
      res.render('admin/add_category', {
        errors: errors,
        title: title
      });
    } else {
        debugger
        Category.findOne({ slug: slug }, function (err, category) {
        if (category) {
          req.flash('danger', 'Category  exists, choose another');
          res.render('admin/add_category', {
            title: title
          });
        } else {
          var category = new Category({
            title: title,
            slug: slug,
            sorting: 100
          });
  
          category.save(function (err) {
            if (err) {
              return console.log(err);
            }
            Category.find({}).sort({ sorting: 1 }).exec(function (err, categories) {
              if (err) {
                console.log(err);
              } else {
                req.app.locals.categories = categories;
              }
            });
            req.flash('success', 'Category added');
            res.redirect('/admin/categories');
          });
        }
      });
    }
  
  });

   //GET Edit Category
router.get('/edit-category/:slug',function(req,res){
console.log('edit value '+ req.params.slug);
    Category.findOne({slug: req.params.slug},function(err,category){
        if(err){
            return;
        }else{
            res.render('admin/edit_category',{
                title: category.title,
                slug: category.slug,
                id: category._id
           });
        }
    });
});

/*
* POST edit page
*/
router.post('/edit-category/:id', function (req, res, next) {

    req.checkBody('title', 'Title must have a value').notEmpty();
  
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;
  console.log('the id value is :-'+ id);
    var errors = req.validationErrors();
  
    if (errors) {
      res.render('admin/edit_category', {
        errors: errors,
        title: title,
        slug: slug,
        id :id
      });
    } else {
        debugger
      Category.findOne({ slug: slug, _id:{'ne':id}}, function (err, category) {
        if (category) {
          req.flash('danger', 'Category slug exists, choose another');
          res.render('admin/edit_category', {
            title: title,
            slug: slug,
            id:id
          });
        } else {
          Category.findById(id,function(err,category){
                if(err){
                    return console.log('error testing :-'+id)
                }else{
                    category.title = title;
                    category.slug = slug;
            category.save(function (err) {
            if (err) {
              return console.log(err +"error saving");
            }
            Category.find({}).sort({ sorting: 1 }).exec(function (err, categories) {
              if (err) {
                console.log(err +"error finding");
              } else {
                req.app.locals.categories = categories;
              }
            });
            req.flash('success', 'Category edited');
            res.redirect('/admin/categories');
          });
                }
          });
        }
      });
    }
  
  });

  /*
* POST reorder pages
*/
router.post('/reorder-categories', function (req, res, next) {
    var ids = req.body['id[]'];
  
    sortPages(ids, function () {
      Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
        if (err) {
          console.log(err);
        } else {
          req.app.locals.pages = pages;
        }
      });
    });
  
  });
  
  /*
/* GET delete category
*/
router.get('/delete-category/:id', function (req, res, next) {
    Category.findByIdAndRemove(req.params.id, function (err) {
      if (err) return console.log(err);
      Category.find({}).sort({ sorting: 1 }).exec(function (err, categories) {
        if (err) {
          console.log(err);
        } else {
          req.app.locals.categories = categories;
        }
      });
  
      req.flash('success', 'Category deleted!');
      res.redirect('/admin/categories');
    });
  });

//exports
module.exports = router