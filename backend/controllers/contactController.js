// controllers/contactController.js
import sendMail from "../utils/sendMail.js"; // Utility function to send mail
import contactAuth from "../zod/contactAuth.js";

export const contactForm = async (req, res) => {
  try {
    const { subject, email, message } = req.body;

    // Validate request body using Zod
    const { success, error } = contactAuth.safeParse(req.body);
    if (!success || error) {
      console.error("Validation Error in contactForm:", error);
      return res.status(400).json({
        msg: "Invalid input data",
        error: error,
      });
    }

    // Email subject and HTML message
    // const subject = "Query Regarding";
    const htmlMessage = `
      <div style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F3F4F6;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 650px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header with Brand -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); padding: 40px 30px; text-align: center; position: relative;">
                            <div style="background-color: rgba(255, 255, 255, 0.15); width: 90px; height: 90px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 3px solid rgba(255, 255, 255, 0.3);">
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
                                </svg>
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">New User Query Received</h1>
                            <p style="color: rgba(255, 255, 255, 0.95); font-size: 14px; margin: 10px 0 0 0; font-weight: 500;">Contact Form Submission Alert</p>
                        </td>
                    </tr>
                    
                    <!-- Notification Badge -->
                    <tr>
                        <td style="padding: 0;">
                            <div style="background: linear-gradient(to right, #10B981, #059669); padding: 12px 30px; text-align: center;">
                                <p style="color: #FFFFFF; font-size: 13px; margin: 0; font-weight: 600; letter-spacing: 0.5px;">
                                    ⚡ PRIORITY: New Message Awaiting Response
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #111827; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">
                                Dear Mr.SR's Shield Cyber Cafe Team,
                            </p>
                            <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                                You have received a new query through your contact form. Please review the submission details below and respond promptly.
                            </p>
                            
                            <!-- Query Details Card -->
                            <div style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); padding: 3px; border-radius: 12px; margin-bottom: 25px;">
                                <div style="background-color: #FFFFFF; padding: 25px; border-radius: 10px;">
                                    <p style="color: #667EEA; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px 0;">
                                        📋 Submission Details
                                    </p>
                                    
                                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                        <!-- Subject Row -->
                                        <tr>
                                            <td style="padding: 15px 0; border-bottom: 1px solid #E5E7EB;">
                                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                    <tr>
                                                        <td style="width: 40px; vertical-align: top;">
                                                            <div style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </div>
                                                        </td>
                                                        <td style="padding-left: 15px;">
                                                            <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                                                            <p style="color: #111827; font-size: 16px; margin: 0; font-weight: 600; line-height: 1.4;">${subject}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Email Row -->
                                        <tr>
                                            <td style="padding: 15px 0; border-bottom: 1px solid #E5E7EB;">
                                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                    <tr>
                                                        <td style="width: 40px; vertical-align: top;">
                                                            <div style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" stroke-width="2" fill="none"/>
                                                                    <path d="M22 6l-10 7L2 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                            </div>
                                                        </td>
                                                        <td style="padding-left: 15px;">
                                                            <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</p>
                                                            <p style="color: #111827; font-size: 16px; margin: 0; font-weight: 600; line-height: 1.4;">
                                                                <a href="mailto:${email}" style="color: #667EEA; text-decoration: none;">${email}</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Timestamp Row -->
                                        <tr>
                                            <td style="padding: 15px 0;">
                                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                    <tr>
                                                        <td style="width: 40px; vertical-align: top;">
                                                            <div style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
                                                                    <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                            </div>
                                                        </td>
                                                        <td style="padding-left: 15px;">
                                                            <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Received At</p>
                                                            <p style="color: #111827; font-size: 16px; margin: 0; font-weight: 600; line-height: 1.4;">${new Date().toLocaleString(
                                                              "en-US",
                                                              {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute:
                                                                  "2-digit",
                                                                second:
                                                                  "2-digit",
                                                                hour12: true,
                                                              },
                                                            )}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Message Content -->
                            <div style="background: linear-gradient(to bottom right, #EEF2FF, #E0E7FF); border-left: 4px solid #667EEA; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 40px; vertical-align: top;">
                                            <div style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                                </svg>
                                            </div>
                                        </td>
                                        <td style="padding-left: 15px;">
                                            <p style="color: #4338CA; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">
                                                💬 Message Content
                                            </p>
                                            <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #C7D2FE;">
                                                <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Action Buttons -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0 20px 0;">
                                <tr>
                                    <td style="text-align: center; padding: 0 5px;">
                                        <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.4);">
                                            📧 Reply to User
                                        </a>
                                    </td>
                                    <td style="text-align: center; padding: 0 5px;">
                                        <a href="${dashboardUrl}" style="display: inline-block; background-color: #F3F4F6; color: #374151; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; border: 2px solid #D1D5DB;">
                                            🎯 View Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Response Time Notice -->
                            <div style="background-color: #FEF3C7; padding: 18px; border-radius: 10px; border-left: 4px solid #F59E0B; margin-top: 25px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 30px; vertical-align: top;">
                                            <span style="font-size: 20px;">⏰</span>
                                        </td>
                                        <td style="padding-left: 12px;">
                                            <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 600; line-height: 1.6;">
                                                <strong>Reminder:</strong> Please respond to this query within 24 hours to maintain excellent customer service standards.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(to right, #F9FAFB, #F3F4F6); padding: 30px; text-align: center; border-top: 2px solid #E5E7EB;">
                            <div style="margin-bottom: 15px;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                                    <circle cx="12" cy="12" r="10" fill="#667EEA" opacity="0.2"/>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#667EEA"/>
                                </svg>
                            </div>
                            <p style="color: #4B5563; font-size: 13px; margin: 0 0 8px 0; font-weight: 700; letter-spacing: 0.5px;">
                                🛡️ Mr.SR's Shield Cyber Cafe
                            </p>
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0; line-height: 1.5;">
                                Contact Form Management System
                            </p>
                            <p style="color: #9CA3AF; font-size: 11px; margin: 15px 0 0 0; line-height: 1.5;">
                                This is an automated notification. Please do not reply to this email.
                            </p>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">
                                    © 2024 Mr.SR's Shield Cyber Cafe. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</div>
    `;

    // Send email using utility function
    await sendMail(subject, htmlMessage, process.env.SMTP_MAIL, email);

    // Respond success
    res.status(200).json({
      msg: "Query sent successfully — Check your inbox and spam folder",
    });
  } catch (error) {
    console.error("Error in contactForm:", error.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
