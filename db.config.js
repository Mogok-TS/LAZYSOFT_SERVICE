//for local test

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "product_item_module",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

//For deploy

// module.exports = {
//     HOST: "localhost",
//     USER: "lazysoft",
//     PASSWORD: "lazYSoft@SE2020TS!",
//     DB: "product_item_module",
//     dialect: "mysql",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };