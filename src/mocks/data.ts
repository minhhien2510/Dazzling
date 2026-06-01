import { User, PhotoboothStore, FeedItem } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Minh Anh', email: 'minhanh@example.com', avatar: 'https://i.pravatar.cc/150?u=1', isOnline: true },
  { id: '2', name: 'Hoàng Nam', email: 'hoangnam@example.com', avatar: 'https://i.pravatar.cc/150?u=2', isOnline: true },
  { id: '3', name: 'Thùy Chi', email: 'thuychi@example.com', avatar: 'https://i.pravatar.cc/150?u=3', isOnline: false },
  { id: '4', name: 'Đức Huy', email: 'duchuy@example.com', avatar: 'https://i.pravatar.cc/150?u=4', isOnline: true },
];

export const mockStores: PhotoboothStore[] = [
  {
    id: 's1',
    name: 'Dazzling Studio Quận 1',
    image: 'https://picsum.photos/seed/studio1/400/300',
    rating: 4.8,
    style: ['Hàn Quốc', 'Minimalist'],
    address: '123 Lê Lợi, Quận 1, TP.HCM',
    coordinates: { lat: 10.7769, lng: 106.7009 },
  },
  {
    id: 's2',
    name: 'Neon Vibe Photobooth',
    image: 'https://picsum.photos/seed/studio2/400/300',
    rating: 4.5,
    style: ['Cyberpunk', 'Neon'],
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    coordinates: { lat: 10.7741, lng: 106.7037 },
  },
];

export const mockFeed: FeedItem[] = [
  {
    id: 'f1',
    userId: '1',
    userName: 'Minh Anh',
    userAvatar: 'https://i.pravatar.cc/150?u=1',
    imageUrl: 'https://picsum.photos/seed/strip1/300/600',
    likes: 24,
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'f2',
    userId: '2',
    userName: 'Hoàng Nam',
    userAvatar: 'https://i.pravatar.cc/150?u=2',
    imageUrl: 'https://picsum.photos/seed/strip2/300/600',
    likes: 15,
    timestamp: Date.now() - 7200000,
  },
];
