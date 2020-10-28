const config=require("../../db.config.js");
const Sequelize=require("sequelize");

//create connection
const sequelize=new Sequelize(config.DB,config.USER,config.PASSWORD,{
    host:config.HOST,
    dialect:config.dialect,
    operatorsAliases:0,
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    }
});

const itemsDB={};
itemsDB.Sequelize=Sequelize;
itemsDB.sequelize=sequelize;
//create model
itemsDB.services=require("./items.model.js")(sequelize,Sequelize);

module.exports=itemsDB;