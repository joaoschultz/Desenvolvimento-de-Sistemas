const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'usuariosdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(connection => {
        console.log('Conexão com o MySQL estabelecida com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao MySQL:', err.message);
        process.exit(1);
    });

module.exports = pool; 