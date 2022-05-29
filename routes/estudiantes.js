const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//llamado al modelo
const Estudiante = require('../models/estudiantes');

//ruta de login
const loginRoute = "../views/pages/login";

router.get('/', (req, res) => {
    if (req.user) {
        res.render('pages/estudiantes/addEdit',{
            viewTitle: 'Nuevo Estudiante'
        });
    
      } else {
        res.render(loginRoute, {
          message: "Por favor inicie sesión para continuar",
          messageClass: "alert-danger",
        });
      }
});

router.post('/', (req, res) =>{
    if (req.user) {
        if(req.body._id == '')
        newEstudiante(req, res)
        else
        updateEstudiante(req, res)
      } else {
        res.render(loginRoute, {
          message: "Por favor inicie sesión para continuar",
          messageClass: "alert-danger",
        });
      }
});

//método para insertar nuevo estudiante
function newEstudiante(req, res){
    var estudiante = new Estudiante();
    estudiante.studentId = req.body.studentId;
    estudiante.name = req.body.name;
    estudiante.birthDate = req.body.birthDate;
    estudiante.gradeLevel = req.body.gradeLevel;
 

    estudiante.save((error) => {
        if(error)
        console.log("Error" + error);
        else
        res.redirect('estudiantes/List');
    });
}



function updateEstudiante(req, res){
  Estudiante.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
      if(!err){
          res.redirect('estudiantes/List');
      } else {
          res.render('estudiantes/addEdit', {
              viewTitle: "Actualizar Estudiantes",
              student: req.body
          })
      }
  })
}


router.get('/List', (req, res)=> {
  if(req.user){
  Estudiante.find((err, doc) => {
      if(!err){
          res.render('pages/estudiantes/List', {
              List: doc,
              viewTitle: "Estudiantes"
          })
      } else {
          console.log("Error" + err);
      }
  });
} else {
  res.render(loginRoute, {
    message: "Por favor inicie sesión para continuar",
    messageClass: "alert-danger",
  });
}

  
})

router.get('/:id', (req, res) => {
  if (req.user) {
      Estudiante.findById(req.params.id, (err, doc) => {
          if(!err){
              res.render('pages/estudiantes/addEdit', {
                  viewTitle: "Actualizar Estudiantes",
                  student: doc
              });
          }
      })
  } else {
      res.render(loginRoute, {
        message: "Please log in to continue",
        messageClass: "alert-danger",
      });
    }
})

router.get('/delete/:id', (req, res) => {
  if (req.user) {
      Estudiante.findByIdAndDelete(req.params.id, (err, doc) =>{
          if(!err){
              res.redirect('/estudiantes/List');
          } else {
              console.log("Error" + err);
          }
      })
    } else {
      res.render(loginRoute, {
        message: "Por favor inicie sesión para continuar",
        messageClass: "alert-danger",
      });
    }
})



module.exports = router;