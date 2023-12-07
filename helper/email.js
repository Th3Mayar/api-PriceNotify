import nodemailer from "nodemailer"
import {google} from "googleapis"

const CLIENT_ID="324505200444-c246anim6lphth7g85kc1uv8t6bhh0u0.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REDIRECT_URI="https://developers.google.com/oauthplayground"
const REFRESH_TOKEN="1//04Uiz5FTTcn8FCgYIARAAGAQSNwF-L9IrzS_y0fIMaCCijo75LXdqLkPt6ANAzcRPyLSh1IjJPFY8LVhTHFt-3EvMl0RE1C-WBaU"

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

const createTrans = async () => nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "wanderroque01@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: await oAuth2Client.getAccessToken()
    }
  });
  const sendEmail = async ({to, subject, html}) => {
    const transporter = await createTrans()
    
    const configEmail = {
        from: '"Pricenotify" <noreply@pricenotify.info>',
        to,
        subject,
        html
    }

    const info = await transporter.sendMail(configEmail)

    console.log("Message sent: %s", info.messageId);
    
    return info;
}
export default sendEmail;