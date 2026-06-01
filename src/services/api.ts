import usersData from '../data/users.json';
import roomsData from '../data/photoboothRooms.json';
import momentsData from '../data/moments.json';
import storesData from '../data/stores.json';
import friendsData from '../data/friends.json';
import messagesData from '../data/messages.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockApiService = {
  getUsers: async () => {
    await delay(800);
    return usersData;
  },
  getRooms: async () => {
    await delay(600);
    return roomsData;
  },
  getMoments: async () => {
    await delay(1000);
    return momentsData;
  },
  getStores: async () => {
    await delay(900);
    return storesData;
  },
  getFriends: async () => {
    await delay(500);
    return friendsData;
  },
  getMessages: async (friendId: string) => {
    await delay(400);
    return messagesData.filter(m => m.senderId === friendId || m.receiverId === friendId);
  },
  login: async (email: string) => {
    await delay(1200);
    const user = usersData.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  }
};
