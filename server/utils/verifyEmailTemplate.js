const verifyEmailTemplate = ({ name, url }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PiMart - Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1), 0 12px 48px rgba(0, 0, 0, 0.15);">
                        <!-- Header Section -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); padding: 60px 40px; text-align: center; border-radius: 24px 24px 0 0;">
                                <img src="https://i.ibb.co.com/NnpctGLZ/logo.png" alt="PiMart Logo" style="width: 120px; height: 120px; margin-bottom: 24px; border-radius: 50%; background-color: white; padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                                <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">Welcome to PiMart</h1>
                                <p style="color: rgba(255, 255, 255, 0.9); font-size: 20px; margin: 12px 0 0;">Your Exclusive Journey Begins</p>
                            </td>
                        </tr>

                        <!-- Content Section -->
                        <tr>
                            <td style="padding: 48px 40px;">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 600;">
                                                Hello ${name},
                                            </h2>
                                            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px;">
                                                We're delighted to welcome you to PiMart's exclusive membership. Your premium shopping experience awaits – simply verify your email to unlock all our exceptional features and personalized benefits.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- CTA Button -->
                                    <tr>
                                        <td align="center" style="padding: 32px 0;">
                                            <a href="${url}" style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px; border-radius: 16px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                                                Activate Your Account
                                            </a>
                                        </td>
                                    </tr>

                                    <!-- Verification Link -->
                                    <tr>
                                        <td style="background: linear-gradient(to right, #f8fafc, #f1f5f9); padding: 24px; border-radius: 0 16px 0 0; margin: 32px 0;">
                                            <p style="margin: 0 0 8px; font-weight: 600; color: #475569;">Alternative Verification Link:</p>
                                            <p style="margin: 0; word-break: break-all; font-size: 14px; color: #64748b;">
                                                ${url}
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Security Notice -->
                                    <tr>
                                        <td style="margin-top: 24px; background: linear-gradient(to right, #fff7ed, #ffedd5); border-left: 4px solid #f97316; padding: 24px; border-radius: 0 0 16px 0;">
                                            <p style="margin: 0; color: #9a3412; font-size: 14px;">
                                                <strong style="display: block; margin-bottom: 8px;">Security Notice:</strong>
                                                For your account security, this verification link will expire in 24 hours. If you didn't create a PiMart premium account, please ignore this email.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background: linear-gradient(to bottom, #f8fafc, #f1f5f9); padding: 40px; text-align: center; border-radius: 0 0 24px 24px;">
                                <!-- Social Media Icons -->
                                <table cellpadding="0" cellspacing="0" border="0" align="center">
                                    <tr>
                                        <td style="padding: 0 8px;">
                                            <a href="#" style="display: inline-block; padding: 12px; background-color: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px; display: block;">
                                            </a>
                                        </td>
                                        <td style="padding: 0 8px;">
                                            <a href="#" style="display: inline-block; padding: 12px; background-color: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px; display: block;">
                                            </a>
                                        </td>
                                        <td style="padding: 0 8px;">
                                            <a href="#" style="display: inline-block; padding: 12px; background-color: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px; display: block;">
                                            </a>
                                        </td>
                                        <td style="padding: 0 8px;">
                                            <a href="#" style="display: inline-block; padding: 12px; background-color: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                                <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" style="width: 24px; height: 24px; display: block;">
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #64748b; font-size: 14px; margin: 24px 0;">© 2025 PiMart. All rights reserved.</p>
                                
                                <div style="display: inline-block; padding: 8px 16px; background-color: white; border-radius: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                    <p style="margin: 0; color: #64748b; font-size: 14px;">
                                        📧 premium.support@pimart.com
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export default verifyEmailTemplate;