'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    motdepasse_actuel: '',
    nouveau_motdepasse: '',
    confimer_motdepasse: '',
  });

  const [errors, setErrors] = useState({
    motdepasse_actuel: '',
    nouveau_motdepasse: '',
    confimer_motdepasse: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(formData)


  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
    console.log(e)

    if(!formData.motdepasse_actuel || !formData.nouveau_motdepasse || !formData.confimer_motdepasse) {
      setErrors({
        motdepasse_actuel: !formData.motdepasse_actuel ? 'Ce champ est requis' : '',
        nouveau_motdepasse: !formData.nouveau_motdepasse ? 'Ce champ est requis' : '',
        confimer_motdepasse: !formData.confimer_motdepasse ? 'Ce champ est requis' : '',
      });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/change-password', {
        current_password: formData.motdepasse_actuel,
        new_password: formData.nouveau_motdepasse,
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.data;
      router.push('/');

    } catch (error) {
      console.error('Erreur de connexion au serveur', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Changer le mot de passe</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modifiez votre mot de passe en toute sécurité
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              name="motdepasse_actuel"
              value={formData.motdepasse_actuel}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe actuel"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                ${errors.motdepasse_actuel ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.motdepasse_actuel && (
              <p className="mt-1 text-sm text-red-500">{errors.motdepasse_actuel}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              name="nouveau_motdepasse"
              value={formData.nouveau_motdepasse}
              onChange={handleChange}
              placeholder="Entrez votre nouveau mot de passe"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                ${errors.nouveau_motdepasse ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nouveau_motdepasse && (
              <p className="mt-1 text-sm text-red-500">{errors.nouveau_motdepasse}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Minimum 8 caractères
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              name="confimer_motdepasse"
              value={formData.confimer_motdepasse}
              onChange={handleChange}
              placeholder="Confirmez votre nouveau mot de passe"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                ${errors.confimer_motdepasse ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confimer_motdepasse && (
              <p className="mt-1 text-sm text-red-500">{errors.confimer_motdepasse}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
            >
              Changer le mot de passe
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}