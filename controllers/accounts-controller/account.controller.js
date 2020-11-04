const model = require("../../models/account-model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const account = model.services;
const secret="S#2O2Opr0ductIT#Mm0duleAPIs"


exports.login = (req, res) => {
    var method = req.body.type;
    if (method == "post" || method == "Post" || method == "POST") {
        account.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(data => {
                //check email is exists or not
                if (data.length > 0) {
                    if(data[0].email==req.body.email){
                        //use bcrypt.compareSync() to compare with hashed password and request password
                        const passwordIsValid = bcrypt.compareSync(req.body.password, data[0].password);
                        if(passwordIsValid){
                            //create JWT(Json Web Token)
                            let token = jwt.sign({ email:req.body.email }, secret, {
                                expiresIn: 86400 // expires in 24 hours
                            })
                            res.status(200).send({
                                status:true,
                                message:"Successfully login.",
                                token:token
                            })
                        }else{
                            res.status(500).send({
                                status:false,
                                message:"Wrong password"
                            })
                        }
                    }
                } else {
                    res.status(404).send({
                        status:false,
                        message:"This email does not exists."
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving items."
                });
            });
    } else {
        res.status(500).send({
            message: "Wrong method."
        });
    }
};