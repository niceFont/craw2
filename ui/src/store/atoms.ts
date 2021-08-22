import {atom} from 'recoil';


export const connectedSocket = atom<WebSocket | null>({
  key: 'socket',
  default: null,
});

export interface User {
  id: string,
  token: string,
  username: string
}
export const user = atom<User | null>({
  key: 'user',
  default: null,
});
