const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//tabla de registro de inscripciones
const inscripcionestSchema = new Schema({
    studentId: String,
    courseId: String,
    date: String
});


const inscripciones = mongoose.model('inscripciones', inscripcionestSchema);

module.exports = inscripciones;