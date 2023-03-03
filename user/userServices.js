var userModel = require('./userModel');
var key = 'somekey234567884456753456';
var encryptor = require('simple-encryptor')(key);

module.exports.createUserDBService = (userDetails) => {

   return new Promise(function myFn(resolve, reject) {
      userModel.findOne({ email: userDetails.email},function getresult(errorvalue, result){
         if(result) {
            resolve({status: true,msg: "Usuario existente en la base de datos"});
         }else{
         resolve({status: false, msg: "Usuario no encontrado"});
            var userModelData = new userModel();
       userModelData.firstname = userDetails.firstname;
       userModelData.lastname = userDetails.lastname;
       userModelData.email = userDetails.email;
       userModelData.password = userDetails.password;
       var encrypted = encryptor.encrypt(userDetails.password);
       userModelData.password = encrypted;
      
       userModelData.save(function resultHandle(errorvalue, result) {
           if (errorvalue) {
               resolve(false);
           } else {
               resolve(true);
           }
       });
         }
      });
   });
}

module.exports.loginuserDBService = (userDetails)=>  {
   return new Promise(function myFn(resolve, reject)  {
      userModel.findOne({ email: userDetails.email},function getresult(errorvalue, result) {
         if(errorvalue) {
            reject({status: false, msg: "Datos Invalidos"});
         }
         else {
            if(result !=undefined &&  result !=null) {
               var decrypted = encryptor.decrypt(result.password);

               if(decrypted== userDetails.password) {
                  resolve({status: true,msg: "Usuario Validado"});
               }
               else {
                  reject({status: false,msg: "Falla en validacion de usuario"});
               }
            }
            else {
               reject({status: false,msg: "Detalles de usuario invalido"});
            }
         }
      });
   });
}

module.exports.findUserDBService = (userDetails) => {
   return new Promise(function myFn(resolve, reject) {
      userModel.findOne({ email: userDetails.email},function getresult(errorvalue, result){
         if(result) {
            resolve({status: true,msg: "Usuario existente en la base de datos"});
         }else{
            reject({status: false, msg: "Usuario no encontrado"});
         }
      });
   });
}

module.exports.updateUserDBService = (userDetails) => {
   var encrypted = encryptor.encrypt(userDetails.password);
   return new Promise (function myFn(resolve, reject) {
      userModel.findOneAndUpdate({email: userDetails.email}, {$set:{firstname: userDetails.firstname, lastname: userDetails.lastname, password: userDetails.password = encrypted}}, function getresult(errorvalue, result){
         if (errorvalue){
            reject({status:false, msg: "correo invalido."});
         }else{
            if (result != undefined && result != null){
               resolve({status: true, msg: "Actualizacion finalizada."});
            }else{
               reject({status: false, msg: "Error al actualizar."})
            }
         }
      });
   });
} 

/*
function getresult(errorvalue, user){
         if(errorvalue){
            reject({status: false, msg: "Datos invalidos"});
         }else if(user){
            user.firstname = userDetails.firstname;
            user.lastname = userDetails.lastname
         }
      }*/

module.exports.deleteUserDBService = (userDetails) => {
   return new Promise(function myFn(resolve, reject) {
      userModel.findOneAndDelete({ email: userDetails.email},function getresult(errorvalue, result){
         if(result) {
            resolve({status: true,msg: "El usuario: " + userDetails.email + " Ha sido eliminado"});
         }else{
            reject({status: false, msg: "Usuario no encontrado"});
         }
      });
   });
}