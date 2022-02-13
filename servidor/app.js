const express = require('express')
const app = express();
const cors = require('cors');
const dotenv = require('dotenv')
const mysql = require('mysql');


dotenv.config();
let instancia = null;

dotenv.config();

const ConexionDB = require('./conexiondb');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//create
app.post('/insert',(request,response)=>{

    const db = ConexionDB.getConexionDB();

    const codigo = request.body.codigo;
    const titulo = request.body.titulo;
    const autor = request.body.autor;
    const cantidad = Number(request.body.cantidad);


    const result = db.insertLibro(codigo,titulo,autor,cantidad);

    result
    .then(datos=> response.json({datos:datos}))
    .catch(err=>console.log(err));

});

app.get('/getAll', (request,response)=>{
    const db = ConexionDB.getConexionDB();
    const result = db.getAllData();
    
    result
    .then(datos=>response.json({datos:datos}))
    .catch(err => console.log(err));
});

app.get('/getDisponibles', (request,response)=>{
    const db = ConexionDB.getConexionDB();
    const result = db.getAllData();
    
    result
    .then(datos=>response.json({datos:datos}))
    .catch(err => console.log(err));
});

app.post('/getPrestados',(request,response)=>{

    const db = ConexionDB.getConexionDB();
    const username = request.body.username;

    const result = db.librosPrestados(username);

    result
    .then(datos => response.json({datos:datos}))
    .catch(err => console.log(err));
});

app.post('/buscar',(request,response)=>{

    const db = ConexionDB.getConexionDB();
    const codigo = request.body.codigo;

    const result = db.buscarPorCodigo(codigo);

    result
    .then(datos=> response.json({datos:datos}))
    .catch(err=>console.log(error))

});

app.post('/createPrestados',async (request,response)=>{

    const db = ConexionDB.getConexionDB();
    const body = request.body;
    
    const result = await db.createPrestados(body)
    .catch(error=>console.log(error))


    const result1= await db.updateStock(body.codigos)
    .catch(error=>console.log(error))
    
    response.status(200).json("Ok");

});


app.listen(process.env.PORT||5000,()=> console.log('app is running'));

