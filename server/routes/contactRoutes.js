import express from "express";
import Contact from "../models/Contact.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields required" });
        }

        const contact = await Contact.create({
            name,
            email,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Message saved",
            data: contact,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/reply", async (req, res) => {
  try {
    const { messageId, reply } = req.body;

    if (!messageId || !reply) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const contact = await Contact.findById(messageId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await sgMail.send({
      to: contact.email,
      from: {
        email: process.env.MAIL_USER,
        name: "Support",
      },
      subject: "Support Reply",
      text: reply,
    });

    contact.replies.push({ message: reply });
    contact.replied = true;
    await contact.save();

    res.json({
      success: true,
      message: "Reply sent and saved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
    });
  }
});

export default router;
