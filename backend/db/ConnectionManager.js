const pgp = require('./credential')

// Function to connect to the database
const dbConnect = async() =>{
   try {
    const cliente = await pgp.connect();
    console.log('Conexion a la base de datos exitosa')
    return cliente
   } catch (error) {
    console.error('Error al conectarse a la Base de datos: ', error)
    throw error
   }
};

// Function to connect to the database
const dbClose = async(cliente) =>{
    try {
    //end connection
     await cliente.$pool.end();
     console.log('Conexion a la base de datos cerrada exitosamente')
    } catch (error) {
     console.error('Error al cerrar la conexion a la Base de datos: ', error)
     throw error
    }
};

module.exports = {
    dbConnect,
    dbClose,
};
