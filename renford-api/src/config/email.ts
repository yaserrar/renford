// Email Service - Console log version for now
// In production, replace with actual email sending (nodemailer, sendgrid, etc.)

interface WelcomeEmailParams {
  email: string;
  prenom: string;
  nom: string;
  password: string;
  role: string;
}

interface PasswordResetEmailParams {
  email: string;
  prenom: string;
  nom: string;
  newPassword: string;
}

/**
 * Send welcome email with credentials when account is created
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  const { email, prenom, nom, password, role } = params;

  console.log(`\n========================================`);
  console.log(`To: ${email}`);
  console.log(`Name: ${prenom} ${nom}`);
  console.log(`New Password: ${password}`);
  console.log(`========================================\n`);
}

/**
 * Send password reset email with new credentials
 */
export async function sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void> {
  const { email, prenom, nom, newPassword } = params;

  console.log(`\n========================================`);
  console.log(`To: ${email}`);
  console.log(`Name: ${prenom} ${nom}`);
  console.log(`New Password: ${newPassword}`);
  console.log(`========================================\n`);
}
