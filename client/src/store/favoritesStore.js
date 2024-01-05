
import { writable, get } from 'svelte/store';
import { userDetails } from './userStore.js'; 
import { API_BASE_URL } from '../utils/auth.js';

const favorites = writable(new Set());


export function toggleFavorite(projectId) {
    let currentFavorites = get(favorites);

    if (currentFavorites.has(projectId)) {
        removeFavorite(projectId); 
    } else {
        currentFavorites.add(projectId);
        updateFavoritesOnServer(projectId);
    }
}

async function updateFavoritesOnServer(newFavoriteProjectId) {
    let token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
    }


    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        console.error('No user email found');
        return;
    }
    try {
        const response = await fetch(API_BASE_URL + "/users/addFavorite", {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail, projectId: newFavoriteProjectId }),
        });

        if (!response.ok) {
            console.error('Error updating favorites:', response.statusText);
            return;
        }
        console.log('Favorite added successfully');
    } catch (error) {
        console.error('Error updating favorites:', error);
    }
}


export async function removeFavorite(projectId) {
    let userEmail;
    userDetails.subscribe(user => {
        if (user) userEmail = user.email;
    })();

    if (!userEmail) {
        console.error('User email not found');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userEmail}/removeFavorite/${projectId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error removing favorite:', response.statusText);
            return;
        }

        favorites.update(favs => {
            favs.delete(projectId);
            return new Set(favs);
        });

        console.log('Favorite removed successfully');
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}
