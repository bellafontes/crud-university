var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');

var http_port = 8000;

/*Configurar os HTML template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection')
var mysql = require('mysql');

app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'agropec.admin',
        password : 'admin',
        port : 3306, 
        database:'Agropec'	
    },'request')

);

app.get('/',function(req,res){
    res.send('Welcome');
});


//RESTful route
var router = express.Router();
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var cliente = router.route('/cliente');
/* LIST CLIENTE */
cliente.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM Clientes', function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('cliente',{title:"RESTful Crud Example",data:rows});

         });

    });

});

/* ADD CLIENTE */
cliente.post(function(req, res, next){

    //validation    
    req.assert('nome','Nome is required').notEmpty();
    req.assert('cpf','A valid CPF is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        nome:req.body.nome,
        cpf:req.body.cpf
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO Clientes set ? ", data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

var cliente_edit = router.route('/cliente/:cpf');

/* EDIT CLIENTE */
cliente_edit.put(function(req,res,next){
    var user_id = req.params.cpf;

    //validation
    req.assert('nome','Name is required').notEmpty();
    req.assert('cpf','A valid cpf is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        nome:req.body.nome,
        cpf:req.body.cpf
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE Clientes set ? WHERE cpf = ? ",[data,cpf], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

/* DELETE CLIENTE */
cliente_edit.delete(function(req,res,next){

    var cpf = req.params.cpf;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM Clientes  WHERE cpf = ? ",[cpf], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

var fornecedor = router.route('/fornecedor');
/* LIST FORNECEDOR */
fornecedor.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM Fornecedor', function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('fornecedor',{title:"RESTful Crud Example",data:rows});

         });

    });

});

/* ADD FORNECEDOR */
fornecedor.post(function(req, res, next){

    //validation  
    req.assert('id','ID is required').notEmpty();  
    req.assert('nome','A valid Nome is required').notEmpty();
    req.assert('tel','A valid Telefone is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        id:req.body.id,
        nome:req.body.nome,
        tel:req.body.tel
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO Fornecedor set ? ", data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

var fornecedor_edit = router.route('/fornecedor/:ID');

/* EDIT FORNECEDOR */
fornecedor_edit.put(function(req,res,next){
    var fornecedor_id = req.params.id;

    //validation
    req.assert('id','ID is required').notEmpty();
    req.assert('nome','A valid name is required').notEmpty();
    req.assert('tel','A valid Telefone is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        id:req.body.id,
        nome:req.body.nome,
        tel:req.body.tel
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE Fornecedor set ? WHERE ID = ? ",[data,id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

/* DELETE FORNECEDOR */
fornecedor_edit.delete(function(req,res,next){

    var id = req.params.id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM Fornecedor  WHERE id = ? ",[id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});


var venda = router.route('/venda');
/* LIST VENDA */
venda.get(function(req,res,next){
    
    
    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM Vendas', function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('venda',{title:"RESTful Crud Example",data:rows});

         });

    });

    var query2 = conn.query('SELECT Dia_venda, Qtde FROM QTDE_Vendida', function(err,rows){

        if(err){
            console.log(err);
            return next("Mysql error, check your query2");
        }

        res.render('venda',{title:"RESTful Crud Example",data:rows});

     });

});

});

/* ADD VENDA */
venda.post(function(req, res, next){

    //validation  
    req.assert('Codigo','Codigo is required').notEmpty();  
    req.assert('CPF_cliente','A valid CPF_cliente is required').notEmpty();
    req.assert('CPF_atendente','A valid CPF_atendente is required').notEmpty();
    req.assert('Tel_cliente','A valid Tel_cliente is required').notEmpty();
    req.assert('CPF_freteiro','A valid CPF_freteiro is required').notEmpty();
    
    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        Codigo:req.body.Codigo,
        CPF_cliente:req.body.CPF_cliente,
        CPF_atendente:req.body.CPF_atendente,
        Tel_cliente:req.body.Tel_cliente,
        CPF_freteiro:req.body.CPF_freteiro
     };

     var data2 = {
        Cod_produto:req.body.Cod_produto,
        Cod_venda:req.body.Cod_venda,
        Dia_venda:req.body.Dia_venda,
        Qtde:req.body.Qtde
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO Vendas set ? ", data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

        var query2 = conn.query("INSERT INTO QTDE_Vendida set ? ", data2, function(err, rows){

            if(err){
                 console.log(err);
                 return next("Mysql error, check your query2");
            }
 
           res.sendStatus(200);
 
         });

     });

});

var venda_edit = router.route('/venda/:Codigo');

/* EDIT VENDA */
venda_edit.put(function(req,res,next){
    var venda_codigo = req.params.codigo;

    //validation
    req.assert('Codigo','Codigo is required').notEmpty();  
    req.assert('CPF_cliente','A valid CPF_cliente is required').notEmpty();
    req.assert('CPF_atendente','A valid CPF_atendente is required').notEmpty();
    req.assert('Tel_cliente','A valid Tel_cliente is required').notEmpty();
    req.assert('CPF_freteiro','A valid CPF_freteiro is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        Codigo:req.body.Codigo,
        CPF_cliente:req.body.CPF_cliente,
        CPF_atendente:req.body.CPF_atendente,
        Tel_cliente:req.body.Tel_cliente,
        CPF_freteiro:req.body.CPF_freteiro,
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE Vendas set ? WHERE Codigo = ? ",[data,Codigo], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

/* DELETE VENDA */
venda_edit.delete(function(req,res,next){

    var Codigo = req.params.Codigo;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM Vendas  WHERE Codigo = ? ",[Codigo], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});


var categoria = router.route('/categoria');
/* LIST CATEGORIA */
categoria.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM Categoria', function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('categoria',{title:"RESTful Crud Example",data:rows});

         });

    });

});

/* ADD CATEGORIA */
categoria.post(function(req, res, next){

    //validation    
    req.assert('ID','ID is required').notEmpty();
    req.assert('Nome','A Nome id is required').notEmpty();
    req.assert('Descricao','A valid Descricao is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {        
        ID:req.body.ID,
        Nome:req.body.Nome,
        Descricao:req.body.Descricao

     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO Categoria set ? ", data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

var categoria_edit = router.route('/cliente/:id');

/* EDIT CATEGORIA */
categoria_edit.put(function(req,res,next){
    var user_id = req.params.ID;

    //validation
    req.assert('ID','ID is required').notEmpty();
    req.assert('Nome','A Nome id is required').notEmpty();
    req.assert('Descricao','A valid Descricao is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        ID:req.body.ID,
        Nome:req.body.Nome,
        Descricao:req.body.Descricao
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE Categoria set ? WHERE id = ? ",[data,id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

/* DELETE CATEGORIA */
categoria_edit.delete(function(req,res,next){

    var ID = req.params.ID;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM Categoria  WHERE id = ? ",[ID], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});


var estancia = router.route('/estancia');
/* LIST ESTÂNCIA */
estancia.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM Estancia', function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('estancia',{title:"RESTful Crud Example",data:rows});

         });

         var query2 = conn.query('SELECT C.Nome FROM Clientes C, Estancia E  WHERE C.CPF = E.CPF_propietario', function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query2");
            }

            res.render('estancia',{title:"RESTful Crud Example",data:rows});

         });

    });

});

/* ADD ESTÂNCIA */
estancia.post(function(req, res, next){

    //validation    
    req.assert('Nome_Estancia','Nome_Estancia is required').notEmpty();
    req.assert('CPF_propietario','A valid CPF_propietario is required').notEmpty();
    req.assert('Referencia','A valid Referencia is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        Nome_Estancia:req.body.Nome_Estancia,
        CPF_propietario:req.body.CPF_propietario,
        Referencia:req.body.Referencia
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO Estancia set ? ", data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

var estancia_edit = router.route('/estancia/:cpf');

/* EDIT ESTÂNCIA */
estancia_edit.put(function(req,res,next){
    var user_id = req.params.cpf;

    //validation
    req.assert('Nome_Estancia','Nome_Estancia is required').notEmpty();
    req.assert('CPF_propietario','A valid CPF_propietario is required').notEmpty();
    req.assert('Referencia','A valid Referencia is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        Nome_Estancia:req.body.Nome_Estancia,
        CPF_propietario:req.body.CPF_propietario,
        Referencia:req.body.Referencia
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE Estancia set ? WHERE Nome_Estancia = ? ",[data,Nome_Estancia], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

/* DELETE ESTÂNCIA */
estancia_edit.delete(function(req,res,next){

    var Nome_Estancia = req.params.Nome_Estancia;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM estancias  WHERE Nome_Estancia = ? ",[Nome_Estancia], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});


// var funcionario = router.route('/funcionario');
// /* LIST FUNCIONARIO*/
// cliente.get(function(req,res,next){


//     req.getConnection(function(err,conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query('SELECT * FROM Funcionarios', function(err,rows){

//             if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//             }

//             res.render('funcionario',{title:"RESTful Crud Example",data:rows});

//          });

//     });

// });

// /* ADD FUNCIONARIO*/
// cliente.post(function(req, res, next){

//     //validation    
//     req.assert('nome','Nome is required').notEmpty();
//     req.assert('cpf','A valid CPF is required').notEmpty();

//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         nome:req.body.nome,
//         cpf:req.body.cpf
//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("INSERT INTO Funcionarios set ? ", data, function(err, rows){

//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//           res.sendStatus(200);

//         });

//      });

// });

// var funcionarios_edit = router.route('/funcionario/:cpf');

// /* EDIT FUNCIONARIO */
// cliente_edit.put(function(req,res,next){
//     var user_id = req.params.cpf;

//     //validation
//     req.assert('nome','Name is required').notEmpty();
//     req.assert('cpf','A valid cpf is required').notEmpty();

//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         nome:req.body.nome,
//         cpf:req.body.cpf
//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("UPDATE Funcionarios set ? WHERE cpf = ? ",[data,cpf], function(err, rows){

//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//           res.sendStatus(200);

//         });

//      });

// });

// /* DELETE FUNCIONARIOS */
// cliente_edit.delete(function(req,res,next){

//     var cpf = req.params.cpf;

//      req.getConnection(function (err, conn) {

//         if (err) return next("Cannot Connect");

//         var query = conn.query("DELETE FROM Funcionarios  WHERE cpf = ? ",[cpf], function(err, rows){

//              if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//              }

//              res.sendStatus(200);

//         });
//         //console.log(query.sql);

//      });
// });

// var produto = router.route('/produto');
// /* LIST PRODUTO */
// venda.get(function(req,res,next){
    
    
//     req.getConnection(function(err,conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query('SELECT * FROM Produtos', function(err,rows){

//             if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//             }

//             res.render('produto',{title:"RESTful Crud Example",data:rows});

//          });

//     });

// });

// /* ADD PRODTUTO */
// venda.post(function(req, res, next){

//     //validation  
//     req.assert('Codigo','Codigo is required').notEmpty();  
//     req.assert('Nome','A valid Nome is required').notEmpty();
//     req.assert('Preco','A valid Preco is required').notEmpty();
//     req.assert('Descricao','A valid Descricao is required').notEmpty();
//     req.assert('ID_categoria','A valid ID_categoria is required').notEmpty();
//     req.assert('ID_fornecedor','A valid ID_fornecedor is required').notEmpty();
//     req.assert('QTD_Estoque','A valid QTD_Estoque is required').notEmpty();
    
//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         Codigo:req.body.Codigo,
//         Nome:req.body.Nome,
//         Preco:req.body.Preco,
//         Descricao:req.body.Descricao,
//         ID_categoria:req.body.ID_categoria,
//         ID_fornecedor:req.body.ID_fornecedor,
//         QTD_Estoque:req.body.QTD_Estoque


//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("INSERT INTO Produtos set ? ", data, function(err, rows){

//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//           res.sendStatus(200);

//         });

//      });

// });

// var PRODUTOS_edit = router.route('/venda/:Codigo');

// /* EDIT PRODUTOS */
// venda_edit.put(function(req,res,next){
//     var venda_codigo = req.params.codigo;

//     //validation
//     req.assert('Codigo','Codigo is required').notEmpty();  
//     req.assert('Nome','A valid Nome is required').notEmpty();
//     req.assert('Preco','A valid Preco is required').notEmpty();
//     req.assert('Descricao','A valid Descricao is required').notEmpty();
//     req.assert('ID_categoria','A valid ID_categoria is required').notEmpty();
//     req.assert('ID_fornecedor','A valid ID_fornecedor is required').notEmpty();
//     req.assert('QTD_Estoque','A valid QTD_Estoque is required').notEmpty();

//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         Codigo:req.body.Codigo,
//         Nome:req.body.Nome,
//         Preco:req.body.Preco,
//         Descricao:req.body.Descricao,
//         ID_categoria:req.body.ID_categoria,
//         ID_fornecedor:req.body.ID_fornecedor,
//         QTD_Estoque:req.body.QTD_Estoque
//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("UPDATE Prdoutos set ? WHERE Codigo = ? ",[data,Codigo], function(err, rows){

//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//           res.sendStatus(200);

//         });

//      });

// });

// /* DELETE PRODUTOS */
// venda_edit.delete(function(req,res,next){

//     var Codigo = req.params.Codigo;

//      req.getConnection(function (err, conn) {

//         if (err) return next("Cannot Connect");

//         var query = conn.query("DELETE FROM Produtos  WHERE Codigo = ? ",[Codigo], function(err, rows){

//              if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//              }

//              res.sendStatus(200);

//         });
//         //console.log(query.sql);

//      });
// });

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(http_port,function(){
   console.log("Listening to port %s",server.address().port);

});