import bcrypt from "bcryptjs";

export class PasswordHandler {
  static hashData = async (data: string) => {
    return await bcrypt.hash(data, 15);
  };

  static compareHashedData = async (plain: string, hash: string) => {
    return await bcrypt.compare(plain, hash);
  };
}
