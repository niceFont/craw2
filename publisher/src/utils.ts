import jwt from 'jsonwebtoken';

export const checkAuthentication = async (token : string) => {
  try {
    await jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch (_error) {
    return false;
  }
};


export const createAuthToken = (socketID : string) => {
  return jwt.sign(socketID, process.env.JWT_SECRET as string);
};


