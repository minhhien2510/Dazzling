import { User } from '../../types';
import { mockUsers } from '../../mocks/data';

export const authService = {
  login: async (email: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email) || mockUsers[0];
        resolve({ user, token: 'fake-jwt-token' });
      }, 1000);
    });
  },
};
