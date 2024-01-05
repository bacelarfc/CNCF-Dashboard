import { writable } from 'svelte/store'; 
import { API_BASE_URL } from '../utils/auth';
export { API_BASE_URL} from "../utils/auth.js"
export const userDetails = writable(JSON.parse(localStorage.getItem('userDetails')) || null);

export function updateUserDetails(data) {
    userDetails.set(data);
    localStorage.setItem('userDetails', JSON.stringify(data));
}
export async function fetchUserDetails() {
    let token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        userDetails.set(null);
        return;
    }
    if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
    }

    try {
        const response = await fetch(API_BASE_URL +'/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json' 
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        
        userDetails.set(data);
    } catch (error) {
        console.error('Error fetching user details:', error);
        userDetails.set(null);
    }
}




