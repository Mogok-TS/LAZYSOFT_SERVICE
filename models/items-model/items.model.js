module.exports=(sequelize,Sequelize)=>{
    const items=sequelize.define("mobile_items",{
        autoID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        itemID:{
            type: Sequelize.INTEGER(45),
            primaryKey: true
        },
        name:{
            type:Sequelize.STRING
        },
        image_name:{
            type:Sequelize.STRING
        },
        image_path:{
            type:Sequelize.STRING
        },
        stock_balance:{
            type:Sequelize.INTEGER(45)
        },
        price:{
            type:Sequelize.INTEGER(45)
        },
        warehouse:{
            type:Sequelize.STRING
        },
        description:{
            type:Sequelize.STRING
        }
    })

    return items;
};