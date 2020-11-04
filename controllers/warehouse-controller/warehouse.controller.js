const jwt=require("jsonwebtoken");

const secret="S#2O2Opr0ductIT#Mm0duleAPIs"


var list=[
    {id:"1",name:"Mandalay"},
    {id:"2",name:"Yangon"},
    {id:"3",name:"NayPyiTaw"},
    {id:"4",name:"Mogok"}
]

exports.getWareHouseList = (req,res) => {
    const token = req.headers['token'];

  if (authorization(token)) {

    var method = req.body.type;
    if (method == "get" || method == "Get" || method == "GET") {
        res.status(200).send({
            status:true,
            data:list
        })
    } else {
        res.status(500).send({
            message: "Wrong method."
        });
    }
}else {
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
  }