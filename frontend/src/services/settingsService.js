import apiClient from './apiClient';
import { API_ROUTES } from '../utils/constants';

/**
 * System Settings API service client
 */
export const settingsService = {
  /**
   * Query paginated, filtered, and sorted system settings
   */
  async listSettings(params = {}) {
    return apiClient.get(API_ROUTES.SETTINGS, { params });
  },

  /**
   * Retrieve a single setting by key
   */
  async getSettingByKey(key) {
    return apiClient.get(`${API_ROUTES.SETTINGS}/${key}`);
  },

  /**
   * Create or upsert a system setting
   */
  async saveSetting(settingData) {
    return apiClient.post(API_ROUTES.SETTINGS, settingData);
  },

  /**
   * Execute advanced operator-based search on system settings
   */
  async searchSettings(searchRequest) {
    return apiClient.post(API_ROUTES.SETTINGS_SEARCH, searchRequest);
  },
};

export default settingsService;
