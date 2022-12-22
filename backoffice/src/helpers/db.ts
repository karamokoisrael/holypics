// import mysql from "mysql";
import mysqldump from "mysqldump" ;
const path = require('path');
const fs = require('fs');

export const getDumpList = (): Promise<string[]>=>{
    const directoryPath = path.join(__dirname, '../../migration');
    return new Promise((resolve, reject)=>{
        fs.readdir(directoryPath, function (err: any, files: Array<string>) {
            //handling error
            if (err) {
                return reject(err);
            } 
            const dumpList: Array<string> = [];
            files.forEach(function (file) {
                dumpList.push(file)
            });
            resolve(dumpList)
        });
    })
}

export const deleteBackup = (id: string, callBack: Function)=>{
    fs.unlink(`./migration/${id}`, callBack)
}

export const dump = ()=>{
    const dumpPath = './migration';
    const fileAge = 24 * 7 * 3600
    fs.readdir(dumpPath, function(err: any, files: string[]) {
        files.forEach(function(file, index) {
            
            fs.stat(path.join(dumpPath, file), function(err: any, stat: Record<string, any>) {
                let endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + fileAge*1000;
                if (now > endTime) {
                    fs.unlink(`${dumpPath}/${file}`, ()=>{
                        console.log("deleting => ", file);
                    })
                }
            });
        });
    });
    
    const dumpName = new Date().toString().replace(/ /g,'_').replace(".sql", "");

    mysqldump({
        connection: {
            host: process.env.DB_HOST as string,
            user: process.env.DB_USER as string,
            password: process.env.DB_PASSWORD as string,
            database: process.env.DB_DATABASE as string,
        },
        dumpToFile: `${dumpPath}/${dumpName}.sql`,
    });
}

// export const getConnection = ()=>{
//     const connection = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE,
//     });
//     return connection;
// }
