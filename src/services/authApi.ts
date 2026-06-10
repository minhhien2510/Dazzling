/** @deprecated Use authService and tokenStorage instead */
export { authService as authApi, getAvatarUrl } from './authService';
export {
  TOKEN_STORAGE_KEY,
  REFRESH_STORAGE_KEY,
  getStoredTokens,
  storeTokens,
  clearStoredTokens,
} from '../utils/tokenStorage';
