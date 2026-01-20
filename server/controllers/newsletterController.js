import Newsletter from "../models/NewsLetter.js";
import transporter from "../configs/node.js";

export const Subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

   const normalizedEmail = email.toLowerCase().trim();
   console.log("Sending email as:", process.env.GMAIL_USER);
   console.log("To subscriber:", normalizedEmail);

  try {
    const exists = await Newsletter.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

     await Newsletter.create({ email: normalizedEmail });
     
     transporter.verify((error, success) => {
  if (error) {
    console.log("GMAIL VERIFY ERROR:", error);
  } else {
    console.log("GMAIL IS READY");
  }
});

    await transporter.sendMail({
      from: `"Travel App" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Welcome to Our Newsletter ✈️",
      html: `
        <h2>You're subscribed!</h2>
        <p>Thanks for joining our travel newsletter.</p>
        <p>You'll now receive exclusive offers and inspiration.</p>
      `,
    });

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default Subscribe;
