import { create } from 'zustand';
import { User } from '../../types';

export interface Room {
  id: string;
  name: string;
  privacy: 'private' | 'invite';
  maxMembers: number;
  theme: string;
  hasMiniGame: boolean;
  members: User[];
  createdAt: number;
  lastActive: string;
}

interface RoomState {
  rooms: Room[];
  activeRoom: Room | null;
  
  // Actions
  createRoom: (config: Omit<Room, 'id' | 'members' | 'createdAt' | 'lastActive'>, creator: User) => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [
    {
      id: '1',
      name: 'Hội chị em',
      privacy: 'private',
      maxMembers: 5,
      theme: 'classic',
      hasMiniGame: true,
      members: [],
      createdAt: Date.now() - 86400000,
      lastActive: '2 phút trước'
    },
    {
      id: '2',
      name: 'Gia đình ❤️',
      privacy: 'private',
      maxMembers: 8,
      theme: 'warm',
      hasMiniGame: false,
      members: [],
      createdAt: Date.now() - 172800000,
      lastActive: '1 giờ trước'
    },
    {
      id: '3',
      name: 'Team Công ty',
      privacy: 'invite',
      maxMembers: 10,
      theme: 'neon',
      hasMiniGame: true,
      members: [],
      createdAt: Date.now() - 259200000,
      lastActive: 'Hôm qua'
    }
  ],
  activeRoom: null,

  createRoom: (config, creator) => {
    const newRoom: Room = {
      ...config,
      id: Math.random().toString(36).substring(2, 9),
      members: [creator],
      createdAt: Date.now(),
      lastActive: 'Vừa xong'
    };
    
    set((state) => ({
      rooms: [newRoom, ...state.rooms]
    }));
    
    return newRoom.id;
  },

  joinRoom: (roomId) => {
    const room = get().rooms.find(r => r.id === roomId);
    if (room) {
      set({ activeRoom: room });
    }
  },

  leaveRoom: () => {
    set({ activeRoom: null });
  }
}));
