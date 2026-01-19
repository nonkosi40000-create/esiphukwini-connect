import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, role }: RegistrationEmailRequest = await req.json();

    console.log(`Sending registration confirmation email to ${email}`);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping email send");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email sending skipped - API key not configured" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7a1a1a, #4a0f0f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            h1 { margin: 0; font-size: 24px; }
            .logo { font-size: 28px; margin-bottom: 10px; }
            .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .role-badge { display: inline-block; background: #7a1a1a; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; text-transform: capitalize; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎓</div>
              <h1>Esiphukwini Junior Primary School</h1>
            </div>
            <div class="content">
              <h2>Thank You for Registering, ${firstName}!</h2>
              <p>Dear ${firstName} ${lastName},</p>
              <p>We have successfully received your registration application as a <span class="role-badge">${role.replace('_', ' ')}</span>.</p>
              
              <div class="highlight">
                <strong>⏳ What happens next?</strong>
                <p style="margin-bottom: 0;">Our administration team is currently reviewing your application. Please wait while we verify your information and documents. This process typically takes 1-3 business days.</p>
              </div>
              
              <p>You will receive another email notification once your application has been processed. In the meantime, you can log in to check your application status at any time.</p>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>
              <ul>
                <li>📧 Email: admin@esiphukwini.edu.za</li>
                <li>📞 Phone: +27 12 345 6789</li>
              </ul>
              
              <p>Thank you for choosing Esiphukwini Junior Primary School. We look forward to having you as part of our community!</p>
              
              <p>Warm regards,<br><strong>The Esiphukwini Administration Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message from Esiphukwini Junior Primary School.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Esiphukwini School <noreply@esiphukwini.edu.za>",
        to: [email],
        subject: "Registration Received - Esiphukwini Junior Primary School",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      
      // Don't fail the registration just because email failed
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Registration successful, but email notification failed",
          emailError: errorText 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-registration-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
