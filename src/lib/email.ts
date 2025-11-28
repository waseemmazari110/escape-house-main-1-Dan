import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EnquiryEmailData {
  name: string;
  email: string;
  phone: string;
  checkin?: string;
  checkout?: string;
  groupSize: string | number;
  occasion?: string;
  addons?: string[];
  message?: string;
  propertyTitle?: string;
  propertySlug?: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  groupSize: string;
  dates: string;
  location?: string;
  experiences?: string[];
  message?: string;
}

export async function sendEnquiryEmail(data: EnquiryEmailData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #89A38F; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1F2937; }
            .value { color: #374151; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Property Enquiry</h1>
            </div>
            <div class="content">
              ${data.propertyTitle ? `
                <div class="field">
                  <span class="label">Property:</span> 
                  <span class="value">${data.propertyTitle}</span>
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Name:</span> 
                <span class="value">${data.name}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span> 
                <span class="value">${data.email}</span>
              </div>
              
              <div class="field">
                <span class="label">Phone:</span> 
                <span class="value">${data.phone}</span>
              </div>
              
              ${data.checkin && data.checkout ? `
                <div class="field">
                  <span class="label">Dates:</span> 
                  <span class="value">${data.checkin} to ${data.checkout}</span>
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Group Size:</span> 
                <span class="value">${data.groupSize}</span>
              </div>
              
              ${data.occasion ? `
                <div class="field">
                  <span class="label">Occasion:</span> 
                  <span class="value">${data.occasion}</span>
                </div>
              ` : ''}
              
              ${data.addons && data.addons.length > 0 ? `
                <div class="field">
                  <span class="label">Experiences Requested:</span>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${data.addons.map(addon => `<li>${addon}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="margin-top: 5px; white-space: pre-wrap;">${data.message}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Group Escape Houses<br>11a North Street, Brighton BN41 1DH</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Group Escape Houses <enquiries@groupescapehouses.co.uk>',
      to: ['hello@groupescapehouses.co.uk'],
      subject: `New Enquiry: ${data.propertyTitle || 'Property Enquiry'} - ${data.name}`,
      html: htmlContent,
      replyTo: data.email,
    });

    if (error) {
      console.error('❌ Failed to send enquiry email:', error);
      throw error;
    }

    console.log('✅ Enquiry email sent successfully:', emailData?.id);
    return emailData;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #89A38F; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1F2937; }
            .value { color: #374151; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span> 
                <span class="value">${data.name}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span> 
                <span class="value">${data.email}</span>
              </div>
              
              ${data.phone ? `
                <div class="field">
                  <span class="label">Phone:</span> 
                  <span class="value">${data.phone}</span>
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Group Size:</span> 
                <span class="value">${data.groupSize}</span>
              </div>
              
              <div class="field">
                <span class="label">Preferred Dates:</span> 
                <span class="value">${data.dates}</span>
              </div>
              
              ${data.location ? `
                <div class="field">
                  <span class="label">Preferred Location:</span> 
                  <span class="value">${data.location}</span>
                </div>
              ` : ''}
              
              ${data.experiences && data.experiences.length > 0 ? `
                <div class="field">
                  <span class="label">Experiences Requested:</span>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${data.experiences.map(exp => `<li>${exp}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="margin-top: 5px; white-space: pre-wrap;">${data.message}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Group Escape Houses<br>11a North Street, Brighton BN41 1DH</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Group Escape Houses <enquiries@groupescapehouses.co.uk>',
      to: ['hello@groupescapehouses.co.uk'],
      subject: `New Contact Form: ${data.name} - ${data.groupSize} guests`,
      html: htmlContent,
      replyTo: data.email,
    });

    if (error) {
      console.error('❌ Failed to send contact email:', error);
      throw error;
    }

    console.log('✅ Contact email sent successfully:', emailData?.id);
    return emailData;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
