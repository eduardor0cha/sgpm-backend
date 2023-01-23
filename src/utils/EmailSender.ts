import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.API_EMAIL,
    pass: process.env.API_EMAIL_PASSWORD,
  },
  from: process.env.API_EMAIL,
});

export const sendEmail = async (props: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: `SGPM Support ${process.env.API_EMAIL}`,
    to: props.to,
    subject: props.subject,
    text: props.text,
    html: props.html,
  });
};

export const sendConfirmationEmail = async (props: {
  userFullName: string;
  email: string;
  token: string;
  days?: number;
  hours?: number;
  minutes?: number;
  type: "accountConfirmation" | "emailReset" | "passwordReset";
}) => {
  let days = props.days ? `${props.days} dias` : undefined;
  let hours = props.hours ? `${props.hours} horas` : undefined;
  let minutes = props.minutes ? `${props.minutes} minutos` : undefined;

  let time = "";
  if (days && hours && minutes) {
    time = `${days}, ${hours} e ${minutes}`;
  } else {
    time = [days, hours, minutes].filter((i) => i).join(" e ");
  }

  let emailTitle: string;
  let emailSubject: string;
  let emailText: string;
  let emailBody: string;
  let emailConfirmBaseURL: string;

  switch (props.type) {
    case "accountConfirmation":
      emailTitle = "Confirme o seu e-mail para sua nova conta";
      emailSubject = "Verificação da conta";
      emailText = `Olá, ${props.userFullName}! Para começar a usar o SGPM, você precisa confirmar o seu e-mail e criar uma senha para a sua nova conta. O código é valido apenas por ${time}. Para confirmar, clique no link: ${process.env.CLIENT_URL}/get-started/${props.token}`;
      emailBody = `
        <body>
            <h1>${emailTitle}</h1>
            <h3>Olá, ${props.userFullName}!</h3>
            <p>Para começar a usar o SGPM, você precisa confirmar o seu e-mail e criar uma senha para a sua nova conta. O código é valido apenas por ${time}.</p>
            <p>Para confirmar, clique no link:</p>
            
            <a class="confirmation-button" href="${process.env.CLIENT_URL}/get-started/${props.token}" target="_blank">Confirmar</a>
            <p>Se você não fez essa requisição, você pode apenas ignorá-la.</p>
        </body>
        `;
      break;

    case "emailReset":
      emailTitle = "Confirme o seu novo endereço de e-mail";
      emailSubject = "Atualização de e-mail";
      emailText = `Olá, ${props.userFullName}! Foi feita uma solicitação de alteração de e-mail para este endereço na sua conta. O código é valido apenas por ${time}. Para confirmar, clique no link: ${process.env.CLIENT_URL}/get-started/${props.token}`;
      emailBody = `
      <body>
          <h1>${emailTitle}</h1>
          <h3>Olá, ${props.userFullName}!</h3>
          <p>Foi feita uma solicitação de alteração de e-mail para este endereço na sua conta. O código é valido apenas por ${time}.</p>
          <p>Para confirmar, clique no link:</p>
          
          <a class="confirmation-button" href="${process.env.CLIENT_URL}/reset-email/${props.token}" target="_blank">Confirmar</a>
          <p>Se você não fez essa requisição, você pode apenas ignorá-la.</p>
      </body>
      `;

      emailConfirmBaseURL = `${process.env.CLIENT_URL}/reset-email`;
      break;

    case "passwordReset":
      emailTitle = "Atualize a sua senha";
      emailSubject = "Atualização de senha";
      emailText = `Olá, ${props.userFullName}! Foi feita uma solicitação de alteração de senha na sua conta. O código é ${props.token} e é válido apenas por ${time}.`;
      emailBody = `
      <body>
          <h1>${emailTitle}</h1>
          <h3>Olá, ${props.userFullName}!</h3>
          <p>Foi feita uma solicitação de alteração de senha na sua conta. O código é valido apenas por ${time}:</p>
          
          <span class="code-container">${props.token}</span>
          <p>Se você não fez essa requisição, você pode apenas ignorá-la.</p>
      </body>
      `;
      break;
  }

  sendEmail({
    to: props.email,
    subject: emailSubject,
    text: `Olá, ${props.userFullName}! ${emailText} O código é valido apenas por ${time}. Para confirmar, clique no link: ${process.env.CLIENT_URL}/get-started/${props.token}`,
    html: `
    <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');
                
                * {
                    font-family: 'Raleway', sans-serif;
                }
                
                .confirmation-button {
                    background-color: #AE2020;
                    text-decoration: none;
                    color: #FAFAFA;
                    font-weight: 500;
                    padding: 0.5rem;
                    border-radius: 4px;
                }
                
                .code-container {
                    border: 2px black solid;
                    width: fit-content;
                    padding: 0.5rem;
                    background-color: #D4D4D4;
                }
            </style>
        </head>
        ${emailBody}
    </html>
    `,
  });
};
