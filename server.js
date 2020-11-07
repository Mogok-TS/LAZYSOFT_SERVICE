const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');//For parse request form-data
const bcrypt=require("bcryptjs")//
const app = express();
const cors = require("cors");

var server = require('http').createServer(app);


var corsOptions = {
   origin: '*',
 }

 app.use(cors(corsOptions));



// parse requests type of form-data

app.use(fileUpload({
    createParentPath: true
}));



// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());




app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    res.setHeader('Content-Type', 'application/json');
    next();
  });

//create item model
const itemsDB = require("./models/items-model");        
itemsDB.sequelize.sync();

//create account model
const account=require("./models/account-model");
const accountDB=account.services
account.sequelize.sync();

//create routes
require("./routes/route")(app);

//create server
const hostname = '0.0.0.0';
const prot = 5000;

server.listen(prot,hostname,()=>{
    console.log(`Server running at ${hostname}:${prot}`)

    if (addNewAccount()){
        console.log("added new item.")
    }
})

app.get('/',(req,res)=>{
    res.send({
        message:"server started."
    })
})

//make static file to public
app.use(express.static(__dirname + '/static/'));

function addNewAccount(){
    const hashedPassword=bcrypt.hashSync("administrator", 10);
    const bodyData={
        userName:"Admin",
        email:"administrator@gmail.com",
        password :hashedPassword
   }
   //check already have or not
   accountDB.findAll({
       where:{
           email:"administrator@gmail.com"
       }
   }).then(
       response=>{
           if(response.length==0){
            accountDB.create(bodyData).then(
                    response=>{
                            return true;
                                }).catch(err=>{
                                    return false;
                });
           }
       }
   ).catch(err=>{
       return false;
   })
   //Adding in mobile_items table

}