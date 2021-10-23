import {User} from '../store/atoms';


const {REACT_APP_AUTH_API} = process.env;

export const getSession = async () : Promise<User | null> => {
  try {
    const res = await fetch(`${REACT_APP_AUTH_API}/me`, {
      credentials: 'include',
      mode: 'cors',
      method: 'GET',
    });

    if (!res.ok) throw new Error(res.statusText);
    else {
      const sess = await res.json();
      return {
        ...sess,
        isLoggedIn: true,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
