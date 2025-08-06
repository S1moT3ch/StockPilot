import axios from 'axios';

export async function checkAuth() {
    const res = axios.get('http://localhost:5000/api/auth/check-auth', {
        withCredentials: true
    });

    if (res.ok) {
        return true;
    } else {
        return false;
    }
}