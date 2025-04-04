const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const User2 = require("./models/User2");

const dbUrl = "mongodb://localhost/usuarios";

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
  
  // create admin user
  const adminUser = new User2({
    Username: "asd",
    password: "password",
    role: "ADMIN",
    correo:"alan2clashofclans82@gmail.com",
    verified:true
  });
  
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.error("Error generating salt:", err);
      return;
    }
    bcrypt.hash(adminUser.password, salt, function(err, hash) {
      if (err) {
        console.error("Error hashing password:", err);
        return;
      }
      adminUser.password = hash;
      adminUser.save((err, user) => {
        if (err) {
          console.error("Error creating admin user:", err);
          return;
        }
        console.log("Admin user created:", user);
        mongoose.disconnect();
      });
    });
  });
});

module.exports = mongoose;