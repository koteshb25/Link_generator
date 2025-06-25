// const express = require("express");
// const router = express.Router();
// const Share = require("../models/Share");
// const { v4: uuidv4 } = require("uuid");
// const axios = require("axios");

// router.post("/create", async (req, res) => {
//   const { senderId, data } = req.body;
//   const token = uuidv4();
//   await Share.create({ token, senderId, data });
//   res.json({ url: `http://localhost:3000/share/${token}` });
// });

// router.post("/verify", async (req, res) => {
//   const { token, phone, captchaToken } = req.body;
//   try {
//     const captchaRes = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify`,
//       null,
//       {
//         params: {
//           secret: process.env.RECAPTCHA_SECRET,
//           response: captchaToken
//         }
//       }
//     );

//     if (!captchaRes.data.success) {
//       return res.status(400).json({ error: "CAPTCHA failed" });
//     }

//     const share = await Share.findOne({ token });
//     if (!share) return res.status(404).json({ error: "Invalid token" });

//     share.recipientPhone = phone;
//     share.accessedAt = new Date();
//     await share.save();

//     res.json({ data: share.data });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Share = require("../models/Share");
const { nanoid } = require("nanoid");

// POST: Create share link and pin
router.post("/create", async (req, res) => {
  const { data } = req.body;
  const shareId = nanoid(8);
  const pin = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit pin

  const newShare = new Share({
    shareId,
    selectedData: data,
    pin,
  });

  await newShare.save();
  res.json({ url: `http://localhost:3000/share/${shareId}`, pin });
});

// POST: Verify PIN and get data
router.post("/verify", async (req, res) => {
  const { shareId, pin } = req.body;
  const share = await Share.findOne({ shareId });

  if (!share) return res.status(404).json({ message: "Invalid or expired link." });
  if (share.pin !== pin) return res.status(401).json({ message: "Incorrect PIN." });

  res.json({ data: share.selectedData });
});

module.exports = router;
