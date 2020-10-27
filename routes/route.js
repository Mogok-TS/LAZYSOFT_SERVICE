module.exports = app => {
    //call items and account controller for linking route
    const account = require("../controllers/accounts-controller/account.controller.js");

    var router = require("express").Router();

    app.use('/module001/', router);

    router.post("/account/login",account.login)

};