import mysql from "mysql";
import mysqldump from "mysqldump" ;
// import { Importer } from "mysql-import";
const Importer = require('mysql-import');
const path = require('path');
const fs = require('fs');
//joining path of directory 


export const getDumpList = (callBack: Function)=>{
    const directoryPath = path.join(__dirname, '../../database');
    const dumpList: Array<string> = [];

    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err: Error, files: Array<string>) {
        //handling error
        if (err) {
            return dumpList;
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            dumpList.push(file)
        });
        callBack(dumpList)
    });
    
}

export const deleteBackup = (id: string, callBack: Function)=>{
    fs.unlink(`../../database/${id}`, callBack())
}


export const dump = ()=>{
    mysqldump({
        connection: {
            host: process.env.DB_HOST as string,
            user: process.env.DB_USER as string,
            password: process.env.DB_PASSWORD as string,
            database: process.env.DB_DATABASE as string,
        },
        dumpToFile: `./database/${new Date()}.sql`,
    });
}

export const restore = ( fileName: string = './dump.sql')=>{
        const importer = new Importer({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        // New onProgress method, added in version 5.0!
        importer.onProgress((progress: any)=>{
        var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
        console.log(`${percent}% Completed`);
        });
    
        importer.import(fileName).then(()=>{

            var files_imported = importer.getImported();

            console.log(`${files_imported.length} SQL file(s) imported.`);

        }).catch((e: Error)=>{
            console.error(e);
        });       
}

export const getConnection = ()=>{
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    return connection;
}
