var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "agropec.admin",
  password: "admin",
  database: "Agropec"
});

con.connect(function(err) {
  if (err) throw err;  
  console.log("Connected!");

  var sql = "INSERT INTO Funcionarios (CPF, Nome) VALUES ('41199288872', 'Henriquess Marcuzzos')";
   con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("1 record inserted", result);
   });

  //  var sql = "INSERT INTO Funcionarios (CPF, Nome) VALUES ('41199288881', 'Henrique')";
  //  con.query(sql, function (err, result) {
  //    if (err) throw err;
  //    console.log("1 record inserted", result);
  //  });
  
//   var sql = "INSERT INTO Funcionarios (CPF, Nome) VALUES ('41199288888', 'Henrique Marcuzzo')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted", result);
//   });

//   var sql = "INSERT INTO Funcionarios (CPF, Nome) VALUES ('41188299999', 'Joaquim Bobo')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted", result);
//   });

// var sql = "INSERT INTO Funcionarios (CPF, Nome) VALUES ('41199288889', 'Marcuzzo')";
//    con.query(sql, function (err, result) {
//      if (err) throw err;
//      console.log("1 record inserted", result);
//    });
   
//   var sql = "DELETE FROM Funcionarios WHERE CPF = '41199288888'";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log(result.affectedRows + " record(s) updated", result);
//   });

//   var sql = "DELETE FROM Funcionarios WHERE CPF = '41199288888'";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Number of records deleted: " + result.affectedRows);
//   });

});