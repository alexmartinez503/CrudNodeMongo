const express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

//llamados a los modelos
const Inscripcion = require("../models/inscripciones");
const Curso = require("../models/cursos");
const Estudiante = require("../models/estudiantes");

//ruta de login
const loginRoute = "../views/pages/login";

router.get("/", (req, res) => {
  if (req.user) {
    res.render("pages/inscripciones/addEdit", {
      viewTitle: "Nueva inscripcion",
    });
  } else {
    res.render(loginRoute, {
      message: "Por favor inicie sesión para continuar",
      messageClass: "alert-danger",
    });
  }
});

router.post("/", (req, res) => {
  //variables para almacenar ids de
  //estudiantes y cursos
  var EstudianteList = new Object();
  var cursoList = new Object();

  Curso.find((err, doc) => {
    if (!err) {
      for (i = 0; i < doc.length; i++) {
        cursoList[i] = doc[i].cursoID;
        Estudiante.find((err, doc) => {
          if (!err) {
            for (i = 0; i < doc.length; i++) {
              EstudianteList[i] = doc[i].studentId;
            }

            if (req.user) {
              var existsEstudiante = false;
              var existsCurso = false;

              //verifica que el estudiante exista
              for (i = 0; i < Object.values(EstudianteList).length; i++) {
                if (EstudianteList[i] == req.body.studentId) {
                  existsEstudiante = true;
                }
              }

              if (existsEstudiante) {
                //si el estudiante existe, verifica si existe el curso
                for (i = 0; i < Object.values(cursoList).length; i++) {
                  if (cursoList[i] == req.body.cursoID) {
                    existsCurso = true;
                  }
                }

                if (existsCurso) {
                  //verifica si se va añadir o actualizar
                  if (req.body._id == "") 
                  newInscripcion(req, res);
                  else 
                  updateInscripcion(req, res);
                } else {
                  res.render("pages/inscripciones/addEdit", {
                    message: "el curso no existe",
                    messageClass: "alert-danger",
                  });
                }
              } else {
                res.render("pages/inscripciones/addEdit", {
                  message: "El estudiante no existe",
                  messageClass: "alert-danger",
                });
              }
            } else {
              res.render(loginRoute, {
                message: "Por favor inicie sesión para continuar",
                messageClass: "alert-danger",
              });
            }
          } else {
            console.log("Error" + err);
          }
        });
      }
    } else {
      console.log("Error" + err);
    }
  });
});

//método para insertar nuevo registro
function newInscripcion(req, res) {
  var inscripcion = new Inscripcion();
  inscripcion.studentId = req.body.studentId;
  inscripcion.courseId = req.body.courseId;
  inscripcion.date = req.body.date;

  inscripcion.save((error) => {
    if (error) console.log("Error" + error);
    else res.redirect("inscripciones/List");
  });
}

function updateInscripcion(req, res) {
  Inscripcion.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("inscripciones/List");
      } else {
        res.render("inscripciones/addEdit", {
          viewTitle: "Actualizar inscripcion",
          Curso: req.body,
        });
      }
    }
  );
}

router.get("/List", (req, res) => {
  if (req.user) {
    Inscripcion.find((err, doc) => {
      if (!err) {
        res.render("pages/inscripciones/List", {
          list: doc,
          viewTitle: "Inscripciones",
        });
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
});

router.get("/:id", (req, res) => {
  if (req.user) {
    Inscripcion.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render("pages/inscripciones/addEdit", {
          viewTitle: "Actualizar Inscripcion",
          inscripcion: doc,
        });
      }
    });
  } else {
    res.render(loginRoute, {
      message: "Por favor inicie sesión para continuar",
      messageClass: "alert-danger",
    });
  }
});

router.get("/delete/:id", (req, res) => {
  if (req.user) {
    Inscripcion.findByIdAndDelete(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect("/inscripciones/List");
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
});

module.exports = router;
