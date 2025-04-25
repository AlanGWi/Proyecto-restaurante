
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose');

const Users= require("./api/users");
const Menu = require("./api/menu")
const Pedidos = require("./api/pedidos")
const User2 = require("./models/User2");
const TransbankRoutes = require("./api/transbank");


var app = express();

mongoose.connect(
  "mongodb://localhost/usuarios",

  { useNewUrlParser: true },
  (err, res) => {
    err && console.log(`ERROR: Connecting to DB ${err}`);

    // crear usuario admin si no existe
    User2.findOne({ Username: "admin" }).then((user) => {
      if (!user) {
        const adminUser = new User2({
          Username: "admin",
          password: "admin",
          role: ["ADMIN"],
          correo:"alan2mitismitis@gmail.com",
          verified:true
        });
        adminUser.save();
        console.log("Usuario admin creado!");
      }
    });

    app.listen(3000, () => console.log("mongodb connected!!"));
  }
);
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//rutas
app.use('/api/users', Users);
app.use('/api/menu', Menu);
app.use('/api/pedidos', Pedidos);
app.use('/api/transbank', TransbankRoutes); // Agregar la ruta de Transbank


module.exports = app;
