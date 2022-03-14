const mysql = require('mysql');
const sqlFormatter = require("sql-formatter");
const connection_details = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'wisepay'
  };

const db = mysql.createConnection(connection_details);
 
db.connect((err)=> {
  if (err) throw 'Someting went wrong';

});

/*
var sql = "SELECT * FROM ?? WHERE ??";
var inserts = ['tests', {id: 1}];
sql = mysql.format(sql, inserts);

console.log(sql)
*/




/*
const req = sqlFormatter.format("SELECT * FROM tbl WHERE test = @test OR foo = @foo", {
    params: {foo: "'bar'", test: "'test'"}
});
console.log(req)
*/

/*
db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

  */

const CrudHandler  = class Crud{
    constructor(db){
        this.db = db;
        this.results;
        this.logs = {
            error: false,
            errorMsg: ""
        };
    }

    initLogs(logs={}){
        if(Object.keys(logs).length>0){
            this.logs = {
                error: logs.error,
                errorMsg: logs.errorMsg
            };
        }else{
            this.logs = {
                error: false,
                errorMsg: ""
            };
        }
        
    }

    customColListFormater(colList){
        let colListStr = ""
        for(const col of colList){
            if(colList.length>0) colListStr += ","

            colListStr += ` ${col} `
    
                
        }

        return colListStr;
    }
    
    customInsertFormatter(query, values){
        let str = "";
        let count = 0;
        const keys = Object.keys(values);
        const len = keys.length-1

        for(const key of keys){
            if(count == len){
                str+=`${key} = "${values[key]}"`
            } else{
                str+=`${key} = "${values[key]}", `;
            }
            count++;
        }

        return `${query} ${str}`
    }
    customSqlFormatter(query, queryConditions, customCondition="", separator=""){

        //customSqlFormatter("SELECT * FROM tbl WHERE", {ok: "oks", test: "tests"})
        let str = ""
        const keys = Object.keys(queryConditions)
    
        for(const key of keys){
            if(str.length>0) str+= separator!="" ? separator : " OR "
            const schema = key+" = @"+key
            str+=schema
        }
    
        if(customCondition.length>0) str+= ` ${customCondition} `
    
        if(str.length>0) query+= ` ${str} `
    
        const finalQuery = sqlFormatter.format(query, {
            params: queryConditions
        });
    
        return finalQuery;
    }

    create(table, values, queryConditions={}, customCondition=""){

        return new Promise((resolve, reject) => {
            const supStr = (Object.keys(queryConditions).length > 0 || customCondition!="" ? " WHERE " : "");
            const query = `INSERT INTO ${table} SET`;
            let sql = this.customInsertFormatter(query, values);
            sql = this.customSqlFormatter(sql, queryConditions, customCondition);
            sql+=supStr
            console.log(sql)
            db.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });    
            }, err => {
        
              reject(err);
            });

    }

    read(table, queryConditions={}, colList=[], customCondition=""){

        return new Promise((resolve, reject) => {
            const supStr = (Object.keys(queryConditions).length > 0 || customCondition!=""? "WHERE" : "");
            colList = colList.length > 0 ? this.customColListFormater(colList) : "*";
            
            //if(colList!="*") colList = this.customColListFormater(colList);
            const query = `SELECT ${colList} FROM ${table} ${supStr}`;
            const sql = this.customSqlFormatter(query, queryConditions, customCondition);

            db.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });    
            }, err => {
        
              reject(err);
            });
    }

    update(table, values, queryConditions={}, customCondition=""){

        return new Promise((resolve, reject) => {
            const supStr = (Object.keys(queryConditions).length > 0 || customCondition!="" ? " WHERE " : "");
            const query = `UPDATE ${table} SET`;
            
            let sql = this.customInsertFormatter(query,values);

            sql+=supStr

            sql = this.customSqlFormatter(sql, queryConditions, customCondition);
            
            console.log(sql)
            db.query(sql, values, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });    
            }, err => {
        
              reject(err);
            });

    }

    delete(table, queryConditions={}, customCondition=""){

        return new Promise((resolve, reject) => {
            const supStr = (Object.keys(queryConditions).length > 0 || customCondition!="" ? "WHERE" : "");
            const query = `DELETE FROM ${table} ${supStr}`;
            const sql = this.customSqlFormatter(query, queryConditions, customCondition);
            console.log(sql)
            db.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });    
            }, err => {
        
              reject(err);
            });
    }

    getlogs(){
        //        this.results = [];this.logs
        return {
            "logs": this.logs,
            "results": this.results
        }
    }


    
}

/*
CrudHandler .read("tests").then((data) => {
    console.log("results => ", data)
}).catch((error) => {
    console.log("results => ", error);

});
*/





module.exports.CrudHandler  = CrudHandler ;
module.exports.db = db;
