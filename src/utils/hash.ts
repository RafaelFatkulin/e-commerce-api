export const hash = async (password: string): Promise<string> => {
    return await Bun.password.hash(password, 'bcrypt');
  };
  
  export const verify = async (
    password: string,
    hash: string
  ): Promise<boolean> => {
    return await Bun.password.verify(password, hash, 'bcrypt');
  };
  