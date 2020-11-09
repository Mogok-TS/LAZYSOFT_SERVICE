const model = require("../../models/items-model");
const itemsDB = model.services;
const jwt = require("jsonwebtoken"); //for JWT.io
const secret = "S#2O2Opr0ductIT#Mm0duleAPIs"// secret key for token
var fs = require('fs');//for unlink(delete) old image in folder


//ADD NEW function
exports.addNew = (req, res) => {
  const token = req.headers['token'];
  //check authorized is true or false
  if (authorization(token)) {

    //check param method type
    var method = req.body.type;
    if (method == "post" || method == "Post" || method == "POST") {
      //check param null
      if (req.body.name == "" || req.body.stock_balance == "" || req.body.price == "" || req.body.warehouse == "" || req.body.description == "") {
        res.status(500).send({
          message: "Fields cannot be empty.Check params."
        });
      }
      //check image files
      if (!req.files) {
        console.log("file => " + req.files);
        res.send({
          status: false,
          message: 'No file uploaded'
        });
        return;
      }

      //get image file from form-data
      let product_image = req.files.image;

      if (product_image.mimetype != "image/png" && product_image.mimetype != "image/jpeg" && product_image.mimetype != "image/jpg") {
        res.status(415).send({
          message: "File type are not allowed."
        });
        return;
      }
      //generate for image name
      var date = new Date();
      var imageType = '';
//set image type
      switch (product_image.mimetype) {
        case 'image/png':
          imageType = '.png'
          break;
        case 'image/jpeg':
          imageType = '.jpg'
          break;
        case 'image/jpg':
          imageType = '.jpg'
          break;
        default:
          imageType = ".png"
          break;
      }
      var imageName = date.getDay() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds() + 1 + imageType;
      //for replace <> tags
      const encryptDes = replaceTags(req.body.description)


      //getting request data
      const bodyData = {
        //generate id for items
        itemID: (Math.floor(100000 + Math.random() * 900000)).toString(),

        name: req.body.name,
        image_name: imageName,
        image_path: "/images/" + imageName,
        stock_balance: req.body.stock_balance,
        price: req.body.price,
        warehouse: req.body.warehouse,
        description: encryptDes
      }

      //not allow when product name is already have in database
      itemsDB.findAll({
        where: {
          name: req.body.name,
          warehouse: req.body.warehouse
        }
      }).then(
        response => {
          if (response.length > 0) {
            res.status(403).send({
              status: false,
              message: "Product name is already exists in this warehouse."
            });
          } else {
            //Adding in mobile_items table
            itemsDB.create(bodyData).then(
              response => {
                //move image file to the static folder
                product_image.mv('./static/images/' + imageName);
                res.send({
                  status: true,
                  message: "Added successfully.",
                });

              }).catch(err => {
                res.status(500).send({
                  message: err.message || "Some error occured while saving new item."
                });
              });
          }
        }
      ).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occured while checking name."
        });
      });

    } else {
      res.status(200).send({
        message: "Wrong method."
      });
    }
  } else {
    res.status(401).send({
      status: false,
      message: "Unauthorized"
    })
  }
};

//GET ALL Function
exports.getAll = (req, res) => {
  const token = req.headers['token'];

  //check authorized is true or false
  if (authorization(token)) {
    var method = req.body.type;
    if (method == "get" || method == "Get" || method == "GET") {
      itemsDB.findAll()
        .then(data => {
          //for set original description
          for (var i = 0; i < data.length; i++) {
            data[i].description = setOriginal(data[i].description)

          }
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving items."
          });
        });
    } else {
      res.status(200).send({
        message: "Wrong method."
      });
    }
  } else {
    res.status(401).send({
      status: false,
      message: "Unauthorized"
    })
  }
};


//GETONE function
exports.get = (req, res) => {
  const token = req.headers['token'];

  //check authorized is true or false
  if (authorization(token)) {
    var method = req.body.type;

    if (method == "get" || method == "Get" || method == "GET") {
      const itemID = req.body.itemID;
//check itemID is null or blank
      if (itemID == null || itemID == undefined || itemID == "" || itemID == " ") {
        res.status(500).send({
          message: "Fields cannot be empty.Check params."
        });
      }
      itemsDB.findOne({ where: { itemID: itemID } })
        .then(data => {

          data.description = setOriginal(data.description);

          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving items."
          });
        });
    } else {
      res.status(200).send({
        message: "Wrong method."
      });
    }
  } else {
    res.status(401).send({
      status: false,
      message: "Unauthorized"
    })
  }
};

//UPDATE Function
exports.update = (req, res) => {
  const token = req.headers['token'];

  //check authorized is true or false
  if (authorization(token)) {
    var method = req.body.type;

    if (method == "update" || method == "Update" || method == "UPDATE") {
      if (req.body.name == "" || req.body.stock_balance == "" || req.body.price == "" || req.body.warehouse == "" || req.body.description == "") {
        res.status(500).send({
          message: "Fields cannot be empty.Check params."
        });
      }

      //for replace <> tags
      const encryptDesc = replaceTags(req.body.description);

      //not allow when product name is already have in database
      itemsDB.findAll({
        where: {
          name: req.body.name,
          warehouse: req.body.warehouse
        }
      }).then(
        response => {
          if (response.length > 0 && req.body.status == "2") {
            res.status(403).send({
              status: false,
              message: "Product name is already exists in this warehouse."
            });
          } else {

            //check image files ,no file no image update
            if (!req.files) {
              var body = {
                name: req.body.name,
                stock_balance: req.body.stock_balance,
                price: req.body.price,
                warehouse: req.body.warehouse,
                description: encryptDesc
              }


            } else {
              //image folder path
              var filePath = './static/images/'


              //get image file from form-data
              let product_image_update = req.files.image;
              //check type
              if (product_image_update.mimetype != "image/png" && product_image_update.mimetype != "image/jpeg" && product_image_update.mimetype != "image/jpg") {
                res.status(415).send({
                  message: "File type are not allowed."
                });
                return;
              }
              //generate for image name
              var date = new Date();
              var imageType = '';

              switch (product_image_update.mimetype) {
                case 'image/png':
                  imageType = '.png'
                  break;
                case 'image/jpeg':
                  imageType = '.jpg'
                  break;
                case 'image/jpg':
                  imageType = '.jpg'
                  break;
                default:
                  imageType = ".png"
                  break;
              }
              var imageName = date.getDay() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds() + 1 + imageType;

              //get image file from form-data
              let product_image = req.files.image;
              product_image.mv('./static/images/' + imageName);

              //get old image name for delete in folder
              var oldImageName = req.body.imageName;

              //getting request data
              var body = {
                name: req.body.name,
                image_name: imageName,
                image_path: "/images/" + imageName,
                stock_balance: req.body.stock_balance,
                price: req.body.price,
                warehouse: req.body.warehouse,
                description: encryptDesc
              }
              fs.unlinkSync(filePath + oldImageName);

            }
            //get product item id from
            const id = req.body.itemID;
            itemsDB.update(body, {
              where: { itemID: id }
            })
              .then(num => {
                if (num == 1) {
                  res.send({
                    status: true,
                    message: "Item was updated successfully."
                  });
                } else {
                  res.send({
                    message: `Cannot update item with id=${id}. Maybe item was not found or params is empty!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating item with id=" + id
                });
              });
          }
        }).catch(err => {
          res.status(500).send({
            message: err.message || "Some error occured while checking name."
          });
        });



    } else {
      res.status(200).send({
        message: "Wrong method."
      });
    }
  } else {
    res.status(401).send({
      status: false,
      message: "Unauthorized"
    })
  }
};

//DELETE Function
exports.delete = (req, res) => {
  const token = req.headers['token'];

  //check authorized is true or false
  if (authorization(token)) {
    var method = req.body.type;

    if (method == "delete" || method == "Delete" || method == "DELETE") {
var itemId=req.body.itemId;
      if (itemID == null || itemID == undefined || itemID == "" || itemID == " ") {
        res.status(500).send({
          message: "Fields cannot be empty.Check params."
        });
      }
      //get image Name for delete
      itemsDB.findAll({ where: { itemID: req.body.itemID } })
        .then(data => {

          //delete data in the database
          itemsDB.destroy({
            where: { itemID: req.body.itemID }
          })
            .then(num => {
              //if deleted successfully in database 
              if (num == 1) {
                //image folder path
                var filePath = './static/images/'
                //if user change image , need to delete old image
                var oldImageName = data[0].image_name;
                fs.unlinkSync(filePath + oldImageName);
                res.send({
                  status: true,
                  message: "Item was deleted successfully!"
                });
              } else {
                res.send({
                  message: `Cannot delete item. Maybe item was not found!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not delete item"
              });
            });


        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving items."
          });
        });


    } else {
      res.status(200).send({
        message: "Wrong method."
      });
    }

  } else {
    res.status(401).send({
      status: false,
      message: "Unauthorized"
    })
  }
};



//for verify token
function authorization(token) {
  //check token is vaild or invaild
  if (!token) {
    return false;
  }
  var verify = jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
  //check jwt is fail or success...
  if (verify) {
    return true;
  } else {
    return false;
  }
};

function replaceTags(text){
  var originalText=text.toString();
  var replaceGT=originalText.replace(/>/g,"#%gt#");
  var replaceLT=replaceGT.replace(/</g,"#%lt#");
  return replaceLT
}

function setOriginal(text){
  var replaceLT=text.toString();
  var replaceGT=replaceLT.replace(/#%gt#/g,">");
  var original=replaceGT.replace(/#%lt#/g,"<");
  return original
}
