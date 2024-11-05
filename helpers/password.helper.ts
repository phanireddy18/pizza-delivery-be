import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = (password: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export const getHashedPassword = async (password: string) => {
  try {
    const hash: string = await hashPassword(password);
    return hash;
  } catch (err) {
    console.error(err);
  }
};

export const comparePassword = function (
  password: string,
  hashedPassword: string
) {
  return bcrypt.compareSync(password, hashedPassword);
};
