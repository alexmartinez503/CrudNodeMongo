const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//tabla de registro del curso
const cursoSchema = new Schema({
    cursoID: String,
    size:String,
    teacherID: String,
    textBook: String
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;