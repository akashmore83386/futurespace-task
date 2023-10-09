const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the account is blocked
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      const timeUntilUnblock = Math.ceil(
        (user.blockedUntil - new Date()) / 1000 / 60
      );
      return res.status(403).json({
        error: `Account is blocked. Try again after 12 hours.`,
      });
    }

    // Verify the password
    if (password !== user.password) {
      // Increment the login attempts
      user.loginAttempts += 1;
      await user.save();

      if (user.loginAttempts >= 3) {
        // Block the account for 12 hours
        user.blockedUntil = new Date(Date.now() + 12 * 60 * 60 * 1000);
        await user.save();

        return res
          .status(401)
          .json({ error: "Invalid password. Account blocked for 12 hours." });
      }

      return res.status(401).json({ error: "Invalid password" });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    await user.save();

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;