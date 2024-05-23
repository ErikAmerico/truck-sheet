import bcrypt from 'bcryptjs';

export async function saltAndHashPassword(plainTextPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainTextPassword, saltRounds);
}

export async function comparePassword(plainTextPassword, hashedPassword) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}
