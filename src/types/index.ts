export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  stats?: {
    totalRooms: number;
    totalPhotos: number;
    streak: number;
  };
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface Comment {
  id: string;
  imageId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: number;
}

export interface ImageAsset {
  id: string;
  url: string;
  groupId: string;
  ownerId: string;
  ownerName: string;
  createdAt: number;
  reactions: Reaction[];
  commentsCount: number;
  visibility: 'group' | 'public' | 'private';
  size?: number;
}

export interface Group {
  id: string;
  name: string;
  members: (User & { role: 'host' | 'member' })[];
  roomImage: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'system';
  timestamp: number;
}

export interface PhotoboothStore {
  id: string;
  name: string;
  image: string;
  rating: number;
  style: string[];
  address: string;
  coordinates: { lat: number; lng: number };
}

export interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  likes: number;
  timestamp: number;
}
