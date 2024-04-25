const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'smtp',
  auth: {
    user: 'tu_correo@gmail.com', // Cambia esto con tus credenciales
    pass: 'tu_contraseña' // Cambia esto con tus credenciales
  }
});

// Ruta para enviar el correo electrónico
app.get('/enviar-correo', async (req, res) => {
  try {
    const imagePath = path.join(__dirname, 'src', 'pictures', 'imagen.jpg'); // Ruta de la imagen
    const imageContent = fs.readFileSync(imagePath); // Lee la imagen

    // Configura el correo electrónico
    const mailOptions = {
      from: 'tu_correo@gmail.com', // Dirección de correo electrónico del remitente
      to: 'destinatario@example.com', // Dirección de correo electrónico del destinatario
      subject: 'Correo con imagen adjunta',
      html: '<p>¡Hola! Aquí tienes una imagen adjunta.</p>',
      attachments: [
        {
          filename: 'imagen.jpg', // Nombre de la imagen adjunta
          content: imageContent, // Contenido de la imagen
          cid: 'imagen' // ID de la imagen para usar en el cuerpo del correo
        }
      ]
    };

    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);
    res.send('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).send('Ocurrió un error al enviar el correo electrónico');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
