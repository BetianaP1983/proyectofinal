var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var novedadesModel = require('../models/novedadesModel')
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function (req, res, next) {

  var novedades = await novedadesModel.getNovedades();

  novedades = novedades.splice(0, 5);
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/images/noimage.jpg'
      }
    }
  });
  res.render('index', {
    novedades
  });

});

router.post('/', async (req, res, next) => {

  console.log(req.body)

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var celular = req.body.celular;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'betumdp30@gmail.com',
    subject: 'Contacto web',
    html: nombre + " " + apellido + " se contacto a traves de la web y quiere mas informacion en este email:" + email + "Ademas, dejo este mensaje:" + mensaje + "Su celular es:" + celular
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente'
  });

});

module.exports = router;
