/**
 * Application-wide constant definitions
 */

export const APP_CONFIG = {
  NAME: 'IndustryOne ERP',
  VERSION: '1.0.0',
  DEFAULT_TITLE: 'IndustryOne ERP - Enterprise SaaS Manufacturing Suite',
  DEFAULT_DESCRIPTION: 'Modern cloud-native enterprise resource planning suite for manufacturing.',
};

export const API_ROUTES = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  HEALTH: '/health',
  SETTINGS: '/settings',
  SETTINGS_SEARCH: '/settings/search',
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  ACTIVE_TENANT_ID: 'active_tenant_id',
  ACTIVE_BRANCH_ID: 'active_branch_id',
  THEME_MODE: 'theme_mode',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
