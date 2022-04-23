let config = {
    knex: {
      // just the usual knex configuration
      client: process.env.DB_CLIENT as string,
      connection: {
        host: process.env.DB_HOST as string,
        database: process.env.DB_DATABASE as string,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
      },
      pool: {
        min: 0,
        max: 10,
      },
      migrations: {
        directory: __dirname + '/migrations',
      },
    },
    dbManager: {
      // db manager related configuration
      collate: ['fi_FI.UTF-8', 'Finnish_Finland.1252'],
      superUser: process.env.DB_USER as string,
      superPassword: process.env.DB_PASSWORD,
      populatePathPattern: 'data/**/*.js', // glob format for searching seeds
    },
  };

const dbManager = require('knex-db-manager').databaseManagerFactory(config);

export const dump = async (basePath = "./")=>{
    try {
            
            const dumpName = new Date().toString().replace(/ /g,'_').replace(".sql", "");
            await dbManager.dropDb(dumpName);
            // {
            //     connection: {
            //         host: process.env.DB_HOST as string,
            //         user: process.env.DB_USER as string,
            //         password: process.env.DB_PASSWORD as string,
            //         database: process.env.DB_DATABASE as string,
            //     },
            //     dumpToFile: `${basePath}database/${dumpName}.sql`,
            // }
        
    } catch (error) {
        console.log(error);
        
    }
}