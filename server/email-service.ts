import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'revalpro2025@gmail.com',
    pass: 'srxv gjgr tyji leje'
  }
});

export async function sendInterestNotification(userEmail: string): Promise<boolean> {
  try {
    // Email to revalpro2025@gmail.com about new signup
    const mailOptions = {
      from: 'revalpro2025@gmail.com',
      to: 'revalpro2025@gmail.com',
      subject: 'New RevalPro Interest Registration',
      html: `
        <h2>New Interest Registration for RevalPro</h2>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Location:</strong> Coming Soon page signup</p>
        
        <hr>
        <p>This user has consented to receive updates about RevalPro launch, product updates, and priority access opportunities.</p>
        <p>They can be contacted at: ${userEmail}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Interest notification sent to revalpro2025@gmail.com for: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending interest notification:', error);
    return false;
  }
}

export async function sendWelcomeEmail(userEmail: string): Promise<boolean> {
  try {
    // Welcome email to the user who signed up
    const mailOptions = {
      from: 'revalpro2025@gmail.com',
      to: userEmail,
      subject: 'Thank you for your interest in RevalPro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Thank you for your interest in RevalPro!</h1>
          
          <p>We're thrilled that you've joined our early access list for RevalPro - the UK's premier NMC revalidation tracker for nurses and midwives.</p>
          
          <h2 style="color: #1e40af;">What happens next?</h2>
          <ul>
            <li>🚀 You'll be among the first to know when RevalPro launches</li>
            <li>📧 Receive exclusive updates about new features and improvements</li>
            <li>⭐ Get priority access when the platform becomes available</li>
            <li>💎 Special early adopter benefits and pricing</li>
          </ul>
          
          <h2 style="color: #1e40af;">About RevalPro</h2>
          <p>RevalPro is designed to transform your NMC revalidation experience with:</p>
          <ul>
            <li>✓ Easy practice hour tracking across different settings</li>
            <li>✓ Comprehensive CPD record management</li>
            <li>✓ AI-powered assistance for reflective accounts</li>
            <li>✓ Automated progress monitoring and reminders</li>
            <li>✓ NMC-compliant document generation</li>
          </ul>
          
          <p>We're working hard to bring you the best possible revalidation experience. Stay tuned for more updates!</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 14px; color: #666;">
            You're receiving this email because you signed up for RevalPro updates. 
            You can unsubscribe at any time by replying to this email.
          </p>
          <p style="font-size: 14px; color: #666;">
            © 2025 RevalPro. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}