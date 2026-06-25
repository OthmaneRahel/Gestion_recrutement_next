'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    axios.post('http://127.0.0.1:8000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
        alert(response.data.message);
        localStorage.removeItem('token');
        router.push('/login');
    }).catch(error => {
      console.error('Erreur lors de la déconnexion', error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 w-full"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}