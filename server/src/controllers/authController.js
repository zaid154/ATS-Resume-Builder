import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";
import { asyncHandler } from "../middleware/error.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ token, user: user.toSafeJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = signToken(user._id);
  res.json({ token, user: user.toSafeJSON() });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "There is no user with that email address" });
  }

  // Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url (using the first CLIENT_URL which is localhost:3000)
  const resetURL = `${process.env.CLIENT_URL?.split(",")[0] || "http://localhost:3000"}/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset - ATS Resume Builder",
      message,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7f6;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
                  <tr>
                    <td style="background-color: #2563eb; padding: 24px; text-align: center;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">ATS Resume Builder</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 32px;">
                      <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 20px; color: #1e293b;">Password Reset Request</h3>
                      <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                        Hello,<br><br>
                        We received a request to reset the password for your account. Click the button below to choose a new password. This link will expire in 10 minutes.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="padding: 10px 0 30px 0;">
                            <a href="${resetURL}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: bold;">Reset Your Password</a>
                          </td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; line-height: 1.5; color: #64748b; margin: 0; border-top: 1px solid #e2e8f0; padding-top: 24px;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                        &copy; ${new Date().getFullYear()} ATS Resume Builder. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    res.status(200).json({
      message: "Token sent to email!",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: "There was an error sending the email. Try again later!" });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Optionally log the user in by sending a token, or just return success
  res.status(200).json({ message: "Password reset successful" });
});
