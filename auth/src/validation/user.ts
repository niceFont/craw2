import {object, string} from 'superstruct';


export default {
  signUp: object({
    email: string(),
    username: string(),
    password: string(),
  }),
  login: object({
    username: string(),
    password: string(),
  }),
};
