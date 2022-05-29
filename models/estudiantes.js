const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//tabla de registro de estudiantes
const estudianteSchema = new Schema({
    studentId: String,
    name: String,
    birthDate: String,
    gradeLevel: String
});


const estudiantes = mongoose.model('estudiantes', estudianteSchema);

module.exports = estudiantes;