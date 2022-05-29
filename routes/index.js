var express = require("express");
var router = express.Router();
const methods = require("../methods");
const Usuario = require("../models/usuarios");

//rutas
const inicioRoute = "../views/pages/inicio";
const loginRoute = "../views/pages/login";
const registerRoute = "../views/pages/register";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//home page route
router.get("/inicio", function (req, res) {
  if (req.user) {
    res.render(inicioRoute, { title: "Pagina de inicio", userName: req.user.fullName });
  } else {
    res.render(loginRoute, {
      message: "Por favor inicie sesión para continuar",
      messageClass: "alert-danger",
    });
  }
});

//register routes

router.get("/register", (req, res) => {
  res.render(registerRoute);
});

router.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    //verificar si las contraseñas coinciden
    if (password === confirmPassword) {
      user = await Usuario.findOne({ email: email }).then((user) => {
        if (user) {
          res.render(registerRoute, {
            message: "El usuario ya esta registrado",
            messageClass: "alert-danger",
          });
        } else {
          const hashedPassword = methods.getHashedPassword(password);
          const userDB = new Usuario({
            fullName: fullName,
            email: email,
            password: hashedPassword,
          });
          userDB.save();

          res.render(loginRoute, {
            message: "El registro se ha completado con éxito",
            messageClass: "alert-success",
          });
        }
      });
    } else {
      res.render(registerRoute, {
        message: "Las contraseñas no coinciden",
        messageClass: "alert-danger",
      });
    }
  } catch (error) {
    console.log("error", error);
  }
});


//login routes

router.get("/login", (req, res) => {
  res.render(loginRoute);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);

  user = await Usuario.findOne({ email: email, password: hashedPassword }).then(
    (user) => {
      if (user) {
        const authToken = methods.generateAuthToken();

        //almacenar el token de autenticacion
        methods.authTokens[authToken] = user;
        //guardar el token en una cookie
        res.cookie("AuthToken", authToken);
        res.redirect("/inicio");
      } else {
        res.render(loginRoute, {
          message: "El nombre de usuario o la contraseña no son válidos",
          messageClass: "alert-danger",
        });
      }
    }
  );
});

//logout
router.get('/logout', (req, res) => {
  res.clearCookie('AuthToken');
  return res.redirect('/login')
});

module.exports = router;
