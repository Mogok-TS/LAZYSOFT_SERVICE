module.exports = app => {
    //call items and account controller for linking route
    const items = require("../controllers/items-controller/items.controller.js");
    const account = require("../controllers/accounts-controller/account.controller.js");
    const wareHouse=require("../controllers/warehouse-controller/warehouse.controller.js")

    var router = require("express").Router();

    app.use('/module001/', router);
    
    //route path for CRUD
    router.post("/items/add", items.addNew);
    router.post("/items/delete",items.delete);
    router.post("/items/get",items.get);
    router.post("/items/update",items.update);
    router.post("/items/getall",items.getAll);
    //route path for login
    router.post("/account/login",account.login);

    //route path for get warehouse lsit
    router.post("/warehouse/getAll",wareHouse.getWareHouseList);

};