import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({to, subject, html}:{to:string, subject:string, html:string}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LMS Support <onboarding@resend.dev>', // Use this for testing
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  } catch (err) {
    console.error("API Call Failed:", err);
  }
};