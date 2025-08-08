import axios from 'axios';

export async function checkAuth() {
    try {
        const token = localStorage.getItem('accessToken');

        const res = await axios.get('http://localhost:5000/api/auth/check-auth', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (err) {

        console.error('Errore durante il check auth:', err.response?.status);
        return false;
    }
}