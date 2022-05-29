const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//tabla de registro de usuarios
const usuarioSchema = new Schema({
    fullName: String,
    email: String,
    password: String
});

//crear un modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;