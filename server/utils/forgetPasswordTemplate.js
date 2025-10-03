
const forgotPasswordTemplate = ({name, otp})=> {
    return `
       <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
        </head>
        <body style="margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); font-family: 'Helvetica Neue', Arial, sans-serif;">
            <table role="presentation" style="max-width: 500px; width: 100%; margin: 0 auto; border-spacing: 0; border-collapse: separate;">
                <!-- Top Design Element -->
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
                
                <!-- Main Content -->
                <tr>
                    <td style="background: white; padding: 0;">
                        <!-- Personalized Greeting -->
                        <div style="padding: 40px 48px 0;">
                            <h2 style="margin: 0; color: #1e40af; font-size: 24px; font-weight: 600;">Hello, ${name}! 👋</h2>
                            <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">Great to see you again</p>
                        </div>

                        <!-- Content Section -->
                        <div style="padding: 30px 48px;">
                            <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                To ensure the security of your account, please use the verification code below:
                            </p>

                            <!-- OTP Display -->
                            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 20px; padding: 30px; margin: 0 0 30px; text-align: center; border: 1px solid rgba(59, 130, 246, 0.1);">
                                <div style="font-family: monospace; font-size: 42px; font-weight: 700; letter-spacing: 0.5em; color: #1e40af; text-shadow: 0 2px 4px rgba(0,0,0,0.05); padding-left: 0.5em;">
                                    ${otp}
                                </div>
                                <p style="margin: 15px 0 0; font-size: 14px; color: #6b7280;">
                                    Code expires in <span style="color: #2563eb; font-weight: 600;">60:00</span> minutes
                                </p>
                            </div>

                            <!-- Security Notice -->
                            <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 16px; padding: 20px; margin-bottom: 30px; border: 1px solid rgba(234, 88, 12, 0.1); border-left: 4px solid #f97316;">
                                <div style="display: flex; align-items: center;">
                                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #9a3412;">
                                        <strong style="display: block; margin-bottom: 8px;">Security Notice:</strong>
                                        For your security, never share this verification code with anyone, including those claiming to be from our company.
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                        📧 pimart@gmail.com
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `
}
export default forgotPasswordTemplate;