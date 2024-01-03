import { writable } from 'svelte/store';

export const cncfData = writable([]);
export const selectedCategory = writable(null);
export const categories = writable([]);
export const logoBaseUrl = "https://landscape.cncf.io/";

export function getFullLogoUrl(logoPath) {
    return `${logoBaseUrl}${logoPath}`;
}

export const chartData = writable({
    labels: [], 
    datasets: [] 
});

// export async function fetchData() {
//     let token = localStorage.getItem('token');
//     if (!token) {
//         console.error('No token found');
//         cncfData.set(null);
//         return;
//     }
//     if (!token.startsWith('Bearer ')) {
//         token = `Bearer ${token}`;
//     }

//     try {
//         const response = await fetch('http://localhost:8081/api/cncf-data', {
//             method: 'GET',
//             headers: {
//                 'Authorization': token
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch user details');
//         }

//         const data = await response.json();
//         cncfData.set(data);

//     } catch (error) {
//         console.error('Error fetching user details:', error);
//         cncfData.set(null);
//     }
// }

export async function fetchData() {
    let token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        cncfData.set([]);
        return;
    }
    if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
    }

    try {
        const response = await fetch('http://localhost:8081/api/cncf-data', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json' 
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch CNCF data');
        }

        const data = await response.json();
        cncfData.set(data);

        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        categories.set(uniqueCategories);
    } catch (error) {
        console.error('Error fetching CNCF data:', error);
        cncfData.set([]);
    }
}
  