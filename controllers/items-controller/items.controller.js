const model = require("../../models/items-model");
const itemsDB = model.services;
const jwt = require("jsonwebtoken"); //for JWT.io
const secret = "S#2O2Opr0ductIT#Mm0duleAPIs"// secret key for token
//give a image name


exports.addNew = (req, res) => {
  const token = req.headers['token'];
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
      //generate for image name
      var date = new Date();
      var imageName = date.getDay() + "" + (date.getMonth() + 1) + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds() + 1 + ".png";
      console.log(imageName)
      //get image file from form-data
      let product_image = req.files.image;
      product_image.mv('./static/images/' + imageName);


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
        description: req.body.description
      }
      console.log(bodyData.itemID);
      //Adding in mobile_items table
      itemsDB.create(bodyData).then(
        response => {
          res.send({
           
            status: true,
            message: "Added successfully.",
          });

        }).catch(err => {
          res.status(500).send({
            message: err.message || "Some error occured while saving new item."
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
//check jwt decode is fail or success
  if (verify) {
    return true;
  } else {
    return false;
  }
}