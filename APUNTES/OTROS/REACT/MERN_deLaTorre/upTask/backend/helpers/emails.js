import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5335c79d99aabc",
      pass: "bb91d0791deea4"
    }
  });

export const emailRegistro = async(datos)=>{
    const {email, nombre, token} = datos
    
    const info = await transport.sendMail({
      from: "UpTASK - Administrador de proyectos <cuentas@uptask.com",
      to: email,
      subject: "UpTASK - Confirma tu cuenta",
      text: "Comprueba tu cuenta en UpTASK",
      html: `<p> Hola, ${nombre} </p>
     <p>Comprueba tu cuenta en UpTASK. Tu cuenta ya está casi lista, solo debes hacer clic en el siguiente enlace: </p>
     <a href="${process.env.STRING_CONNECTION_CORS2 }/confirmar/${token}">Comprobar cuenta</a>
     <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
      `    
    })
}

export const emailOlvidePassword = async(datos)=>{
  const {email, nombre, token} = datos
  
  const info = await transport.sendMail({
    from: "UpTASK - Administrador de proyectos <cuentas@uptask.com",
    to: email,
    subject: "UpTASK - Recupera tu password",
    text: "Comprueba tu cuenta en UpTASK",
    html: `<p> Hola, ${nombre} </p>
   <p>Recupera tu password de UpTASK. Para ello, solo debes hacer clic en el siguiente enlace: </p>
   <a href="${process.env.STRING_CONNECTION_CORS2 }/olvide-password/${token}">Recuperar password</a>
   <p>Si no quieres recuperar tu password, puedes ignorar el mensaje </p>
    `    
  })
}