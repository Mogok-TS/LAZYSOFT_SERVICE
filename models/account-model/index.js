var config=require("../../db.config.js")
var Sequelize=require("sequelize")

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

const accocutTB={};
accocutTB.Sequelize=Sequelize;
accocutTB.sequelize=sequelize;
//create model
accocutTB.services=require("./account.model.js")(sequelize,Sequelize);

module.exports=accocutTB;