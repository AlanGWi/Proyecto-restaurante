'use strict';
var jwt = require("jsonwebtoken")
var Users = require('../models/User2')

// Middleware de autorización que recibe uno o más roles permitidos
const authorize = (role) =>
 function(req, res, next) {
     // Imprimir el token recibido por body, query o headers (útil para debug)
  console.log(req.body.token)
  const token =
  // Obtener el token desde distintas fuentes: body, query o headers
  req.body.token || req.query.token || req.headers["x-access-token"];

  console.log(req.body.token);
  console.log(req.headers)

   // Si no se proporciona un token, denegar el acceso
  if (!token) {
    return res.status(403).send("Se necesita un token para autentificar");
  }
  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token,'secret', process.env.JWT_KEY);
    console.log(decoded)
    if(role.length > 0){
          // Si hay roles requeridos, validar si el usuario tiene alguno
      Users.findOne({Username: decoded.Username})
        .then((user) => {
          let allowed = false 
          console.log(user.role, user.Username)
           // Verificar si alguno de los roles del usuario está permitido
          for (const r of user.role){
            if (role.includes(r))
              allowed = true
          }
          if (allowed){
            return next()
          }else{
            return res.status(401).send('Usuario no tiene permisos para realizar la operación')
          }
        })
    }else{
      return next()
      }
  } catch (err) {
    return res.status(401).send("Token invalido");
  }
};


module.exports = authorize