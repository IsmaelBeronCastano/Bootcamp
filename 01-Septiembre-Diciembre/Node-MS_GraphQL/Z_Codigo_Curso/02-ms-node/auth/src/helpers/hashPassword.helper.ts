import bcrypt from "bcryptjs";

export const hashPassword = (plainText: string) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(plainText, salt);

  return hash;
};

export const comparePassword = (plaintText: string, hash: string) => {
  return bcrypt.compareSync(plaintText, hash);
};
