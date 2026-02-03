// Génère un mot de passe aléatoire de 12 caractères
export function generatePassword(): string {
  const chars = '0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
