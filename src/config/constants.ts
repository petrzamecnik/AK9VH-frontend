export const API_URL = 'http://localhost:3000';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    HOMEPAGE: '/homepage'
} as const;

export const API_ENDPOINTS = {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout'
} as const;