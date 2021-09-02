import {atom} from 'recoil';


export const connectedSocket = atom<WebSocket | null>({
  key: 'socket',
  default: null,
});

export interface User {
  id: string | null,
  token: string | null,
  username: string | null,
  email: string | null,
  isLoggedIn: boolean,
  guest: boolean
}
export const user = atom<User | null>({
  key: 'user',
  default: {
    id: null,
    token: null,
    username: null,
    email: null,
    isLoggedIn: false,
    guest: false,
  },
});
