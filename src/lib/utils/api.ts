import { get } from 'svelte/store';
import { authStore } from '../../stores/authStore';
import { API_URL } from '../../config/constants';

interface FetchOptions extends RequestInit {
    auth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
    const { auth = false, ...fetchOptions } = options;

    // Create a new headers object
    const headers = new Headers({
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string> || {})
    });

    // Add auth token if required
    if (auth) {
        const token = get(authStore).token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers
    });

    // Handle unauthorized responses
    if (response.status === 401) {
        authStore.logout();
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    return response;
}