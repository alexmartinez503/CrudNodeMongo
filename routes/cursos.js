const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

//llamado al modelo
const Curso = require('../models/cursos');

//ruta de login
const loginRoute = "../views/pages/login";

router.get('/', (req, res) => {
    if(req.user) {
    res.render('pages/cursos/addEdit', {
        viewTitle: 'Nuevo Curso'
    });
        }else {
            res.render(loginRoute, {
                message: "Por favor inicie sesión para continuar ",
                messageClass: "alert-danger",
        
    });
    }
});

router.post('/', (req, res) =>{
    if (req.user) {
        if(req.body._id == '')
        newCurso(req, res)
        else
        updateCurso(req, res)
      } else {
        res.render(loginRoute, {
          message: "Por favor inicie sesión para continuar",
          messageClass: "alert-danger",
        });
      }
});




//método para insertar nuevo registro
function newCurso(req, res){
    var curso = new Curso();
    curso.cursoID = req.body.cursoID;
    curso.size = req.body.size;
    curso.teacherID = req.body.teacherID;
    curso.textBook = req.body.textBook;

    curso.save((error) => {
        if(error)
        console.log("Error" + error);
        else
        res.redirect('cursos/List');
    });
}

function updateCurso(req, res){
    Curso.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('cursos/List');
        } else {
            res.render('cursos/addEdit', {
                viewTitle: "Actualizar Curso",
                course: req.body
            })
        }
    })
}

router.get('/List', (req, res)=> {
    if(req.user){
    Curso.find((err, doc) => {
        if(!err){
            res.render('pages/cursos/List', {
                list: doc,
                viewTitle: "Cursos"
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
        Curso.findById(req.params.id, (err, doc) => {
            if(!err){
                res.render('pages/cursos/addEdit', {
                    viewTitle: "Actualizar cursos",
                    course: doc
                });
            }
        })
    } else {
        res.render(loginRoute, {
          message: "Por favor inicie sesión para continuar",
          messageClass: "alert-danger",
        });
      }
})

router.get('/delete/:id', (req, res) => {
    if (req.user) {
        Curso.findByIdAndDelete(req.params.id, (err, doc) =>{
            if(!err){
                res.redirect('/cursos/List');
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