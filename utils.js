const mysql = require("mysql");
const fs = require("fs");
const { con } = require("./../con");
const path = require("path");

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "z10mz10m",
//   database: "data",
// });

function creatDataBase() {
  //drop
  var dropSql = "DROP DATABASE  IF EXISTS data ;";
  con.query(dropSql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  //create
  var createDataBase = "CREATE DATABASE IF NOT EXISTS data ;";
  con.query(createDataBase, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  //use
  var useTable = "USE data ;";
  con.query(useTable, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
}

const filesNameArray = ["school", "teacher", "student", "classroom", "admin"];
function createTables() {
  filesNameArray.forEach((fileName) => {
    let columnstr = "";
    const file_path = path.join(__dirname, `/entities/${fileName}.json`);
    fs.readFile(file_path, "utf8", (err, res) => {
      if (err) console.log(err);
      else {
        console.log("res: ", res);
        console.log("res.columns: ", JSON.parse(res).columns);
        JSON.parse(res).columns.forEach((column, index) => {
          columnstr += ` ${column[0]} ${column[1]}`;
          if (index !== JSON.parse(res).columns.length - 1) columnstr += ", ";
        });
        var sql = `CREATE TABLE ${fileName} (${columnstr})`;
        console.log("sql: ", sql);
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table created");
        });
      }
    });
  });
}

function showTable() {
  filesNameArray.forEach((fileName) => {
    con.query(`SELECT * FROM ${fileName}`, function (err, result) {
      if (err) throw err;

      console.log(fileName);
      console.table(result);
    });
  });
}

//AD ADMIN
function insertAdmins() {
  const sql = "INSERT INTO admin (name, password, school_id) VALUES ? ";
  const values = [
    ["Dor", "1234", "1"],
    ["Eliyan", "23456", "2"],
  ];
  con.query(
    sql,
    [values],

    function (err, result) {
      if (err) throw err;

      console.table(result);
    }
  );
}

//add
function addToTable(tableName, columns, values) {
  // con.connect(function (err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  // const columnsStr=""
  // values.forEach()
  const sql = `INSERT INTO ${tableName} (${columns.toString()}) VALUES ?`;
  console.log("sql: ", sql);

  con.query(
    sql,
    [[values]],

    function (err, result) {
      if (err) throw err;

      console.table(result);
    }
  );
}

//delete
function deleteFromTable(tableName, deletedId) {
  const sql = `DELETE FROM ${tableName} WHERE id=${deletedId}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result: ", result);
  });
}

//get admin`s password
function adminPassword(adminId, insertedPassword) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT password FROM admin WHERE id=${adminId}`;
    con.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result[0].password == insertedPassword);
    });
  });
}

//change row
function change(tableName, field, value, teacher_id) {
  const sql = `UPDATE ${tableName} SET  ${field}="${value}" WHERE  id="${teacher_id}"`;
  con.query(sql, (err, result) => {
    if (err) throw err;
  });
}

// adminPassword("1", "1234");

// creatDataBase();
// createTables();
// insertAdmins();
showTable();

module.exports = {
  creatDataBase,
  insertAdmins,
  showTable,
  createTables,
  addToTable,
  deleteFromTable,
  adminPassword,
  change,
};
