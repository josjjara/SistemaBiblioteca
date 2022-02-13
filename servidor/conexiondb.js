const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instancia = null;

const conexion = mysql.createConnection({

    host: 'localhost',
    user: 'admin',  
    password: '123', 
    port: 3306, 
    database: 'bibliotecaweb'

});

conexion.connect((err) =>{
    if(err){
        console.log(err.message);
    }
    console.log('biblioteca_web:' + conexion.state);

} );



class ConexionDB{
    
    static getConexionDB(){
        return instancia ? instancia : new ConexionDB();
    }

    async buscarPorCodigo(codigo){

        const response = await new Promise((resolve,reject)=>{

            const query = "SELECT * FROM libros WHERE codigo = ?;";

            conexion.query(query,codigo,(err, result)=>{
                if(err) reject(new Error (err.message));
                resolve(result);
            });
        });

        if(!response.length){
            return false;
        }
        else{
            return response;
        }
    }

    async getAllData(){

        try{
            const response = await new Promise((resolve,reject)=>{

                const query = "SELECT * FROM libros;";

                conexion.query(query,(err, result)=>{
                    if(err) reject(new Error (err.message));
                    resolve(result);
                });
            });

            return response;

        } catch(error){
            console.log(error);
        }
    }

    async insertLibro(codigo,titulo,autor,cantidad){

        try{
            const response = await this.buscarPorCodigo(codigo);

            if(!response.length){
                
                const insertID = await new Promise((resolve,reject)=>{
                
                    const query = "INSERT INTO libros (codigo,titulo,autor,cantidad) VALUES (?,?,?,?);";

                    conexion.query(query, [codigo,titulo,autor,cantidad] ,(err, result)=>{
                        if(err) reject(new Error (err.message));
                        resolve(result.insertID);
                    })
                });

            return insertID;

            }else{
                const cantidadNueva = response[0].cantidad + 1;
                const query = "UPDATE libros SET cantidad= ? WHERE codigo = ?;";
                conexion.query(query, [cantidadNueva,codigo] ,function(error, results) {
                    if(error) {
                        console.log(error);
                            return;
                    }
                });
                return false;
            }

        } catch(error){
            console.log(error);
        }
    }

    async insertarLibrosPrestados(username,codigo){

        try{

            const insertID = await new Promise((resolve,reject)=>{

                const query = "INSERT INTO prestamos(username,codigo_libro,fecha_reserva,fecha_devolucion) Values(?,?,current_date(),DATE_ADD(current_date,INTERVAL 30 DAY));";

                conexion.query(query, [username,codigo] ,(err, result)=>{
                    if(err) reject(new Error (err.message));
                    resolve(result);
                })
            });
            
            return {
                username: username,
                codigo: codigo,
                fecha_reserva: fecha_reserva,
                fecha_devolucion: fecha_devolucion
            };

        } catch(error){
            console.log(error);
        }
    }

    async librosPrestados(username){
        try{

            const responsePrestamos = await new Promise((resolve,reject)=>{

                const query = "SELECT titulo,autor,fecha_reserva,fecha_devolucion FROM libros l, prestamos p, usuarios u WHERE l.codigo = p.codigo_libro AND p.username = u.username AND u.username = ?;";

                conexion.query(query, [username] ,(err, result)=>{
                    if(err) reject(new Error (err.message));
                    resolve(result);
                });
            });

            const responseDisponibles = await new Promise((resolve,reject)=>{

                const query = "SELECT * FROM libros WHERE codigo NOT IN (SELECT codigo FROM libros l, prestamos p, usuarios u WHERE l.codigo = p.codigo_libro AND p.username = u.username AND u.username = ?);";

                conexion.query(query, [username] ,(err, result)=>{
                    if(err) reject(new Error (err.message));
                    resolve(result);
                });
            });

            return [responsePrestamos,responseDisponibles];

        } catch(error){
            console.log(error);
        }
    }

    async createPrestados(body){

        try{

            const responsePrestamos = await new Promise((resolve,reject)=>{
                
                var sql = "INSERT INTO prestamos (codigo_libro, username) VALUES ?";
                var values = [];

                for(let codigo of body.codigos){
                    values.push([codigo.trim(), body.username]);
                }
    
                conexion.query(sql, [values], (err, result)=>{
                    if(err) reject(new Error (err.message));
                    resolve(result);
                });
            });


        } catch(error){
            console.log(error);
        }


    }

    async updateStock(codigos){

        try{
        
        const responsePrestamos = await new Promise((resolve,reject)=>{
                
            var sql = "UPDATE libros SET cantidad = (cantidad - 1) WHERE codigo in (?) AND cantidad > 0;";

            conexion.query(sql,codigos, (err, result)=>{
                if(err) reject(new Error (err.message));
                resolve(result);
            });
        });

        }catch(error){
            console.log(error);
        }
    }

}

module.exports = ConexionDB;