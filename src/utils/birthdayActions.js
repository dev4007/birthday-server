import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken);

const mp3Path = ""

export const sendBirthdayCall = async (user) => {
  try {
    const formattedNumber = user.mobileNumber 

    const call = await client.calls.create({
      twiml: `<Response><Play>${mp3Path}</Play></Response>`,
      to: formattedNumber,
      from: twilioPhone,
    });

    console.log(
      `Call initiated to ${user.firstName} ${user.lastName}: ${call.sid}`
    );
  } catch (err) {
    console.error(
      `Error making call to ${user.firstName} ${user.lastName}: ${err.message}`
    );
    throw new Error("Failed to make birthday call");
  }
};
