import Newsletter from "../models/NewsLetter.js";
import { transporter } from "../configs/node.js";

export const Subscribe = async (req, res) => {
   const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Email already subscribed" });
    }

    await Newsletter.create({ email });

    await transporter.sendMail({
      from: `"Travel App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Newsletter ✈️",
      html: `
        <h2>You're subscribed!</h2>
        <p>Thanks for joining our travel newsletter.</p>
        <p>You'll now receive exclusive offers and inspiration.</p>
      `,
    });

    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }};
  
export default Subscribe;
