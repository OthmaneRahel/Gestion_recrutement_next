// app/settings/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiLock,
  FiShield,
  FiClock,
  FiChevronRight,
  FiUser,
  FiMail,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

export default function SettingsHomePage() {
  const user = useCurrentUser();
  const router = useRouter();

  const quickActions = [
    {
      title: 'Sécurité',
      description: 'Modifier votre mot de passe',
      icon: FiLock,
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      href: '/settings/update-password',
    },
    {
      title: 'Historique',
      description: 'Consulter vos candidatures',
      icon: FiClock,
      color: 'blue',
      gradient: 'from-blue/20 to-blue/5',
      href: '/user/historique-candidatures',
    },
    {
      title: 'Compte',
      description: 'Désactiver votre compte',
      icon: FiShield,
      color: 'red',
      gradient: 'from-red/20 to-red/5',
      href: '/settings/desactivation-account',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Profil */}
    
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-5 p-5 bg-gradient-to-r from-primary/5 to-primary/0 rounded-2xl border border-primary/10"
      >
        {/* Partie gauche : Avatar et infos */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green rounded-full border-2 border-white flex items-center justify-center">
              <FiCheckCircle className="text-white text-[10px]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {user?.first_name} {user?.last_name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <FiMail className="text-sm" />
                {user?.email}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-green font-medium flex items-center gap-1">
                <FiCheckCircle className="text-[10px]" />
                Compte vérifié
              </span>
            </div>
          </div>
        </div>

        {/* Partie droite : Bouton */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/user/profile')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-primary/20"
        >
          <FiUser className="text-sm" />
          <span>Voir mon profil</span>
          <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colorMap = {
            primary: 'text-primary bg-primary/10 border-primary/20',
            blue: 'text-blue bg-blue/10 border-blue/20',
            red: 'text-red bg-red/10 border-red/20',
          };

          return (
            <motion.div key={action.href} variants={itemVariants}>
              <Link href={action.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[action.color as keyof typeof colorMap]}`}>
                        <Icon className="text-xl" />
                      </div>
                      <motion.div
                        initial={{ x: -5, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-1 text-sm font-medium text-primary"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Accéder</span>
                        <FiArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </div>
                    <h3 className="font-semibold text-foreground mt-4">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}