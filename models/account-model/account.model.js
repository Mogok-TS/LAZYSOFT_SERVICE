module.exports=(sequelize,Sequelize)=>{
    const items=sequelize.define("accounts",{
        autoID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        }
    })

    return items;
};