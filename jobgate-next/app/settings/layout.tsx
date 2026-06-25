'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLock,
  FiShield,
  FiClock,
  FiLogOut,
  FiSettings,
  FiUser,
  FiMenu,
  FiX,
  FiArrowLeft,
  FiBell,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import axios from 'axios';
import { useWebSocket } from '@/contexts/WebSocketContext';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    label: 'Mot de passe',
    icon: FiLock,
    href: '/settings/update-password',
    description: 'Modifier votre mot de passe'
  },
  {
    label: 'Désactivation',
    icon: FiShield,
    href: '/settings/desactivation-account',
    description: 'Supprimer votre compte'
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ⭐ RÉCUPÉRER LES NOTIFICATIONS DU CONTEXTE
  const { 
    isConnected, 
    notifications, 
    markAsRead, 
    removeNotification,
    clearAllNotifications 
  } = useWebSocket();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/signout/', {
        refresh: localStorage.getItem("refresh-token")
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token-login")}`,
          'Content-Type': 'application/json',
        }
      });
      localStorage.removeItem('token-login');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixe */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100
          transition-shadow duration-300
          ${isScrolled ? 'shadow-sm' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <FiSettings className="text-white text-lg" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Paramètres</h1>
                <p className="text-xs text-gray-400">Gestion du compte</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* ⭐ BOUTON NOTIFICATIONS */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2.5 rounded-full hover:bg-gray-50/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <FiBell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-lg"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-[400px] max-h-[80vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-gray-200/50 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100/50">
                        <div className="flex items-center gap-2">
                          <FiBell className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                            >
                              Tout effacer
                            </button>
                          )}
                          <button
                            onClick={() => setIsNotifOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FiX className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Liste des notifications */}
                      <div className="overflow-y-auto max-h-[400px]">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <FiBell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p>Aucune notification</p>
                            <p className="text-sm text-gray-400">
                              Les nouveaux forums apparaîtront ici
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                              <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 hover:bg-gray-50 transition-colors ${
                                  !notification.read ? 'bg-blue-50/50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          Nouveau Forum créé : {notification.forum.nom}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                          📍 {notification.forum.lieu}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          📅 {new Date(notification.forum.date_forum).toLocaleDateString('fr-FR')}
                                        </p>
                                        {notification.forum.description && (
                                          <p className="text-sm text-gray-500 mt-1">
                                            {notification.forum.description}
                                          </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                          {new Date(notification.timestamp).toLocaleString('fr-FR')}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                        {!notification.read && (
                                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                        <button
                                          onClick={() => markAsRead(notification.id)}
                                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                          title="Marquer comme lu"
                                        >
                                          <FiCheckCircle className={`h-4 w-4 ${
                                            notification.read ? 'text-green-500' : 'text-gray-300'
                                          }`} />
                                        </button>
                                        <button
                                          onClick={() => removeNotification(notification.id)}
                                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                          title="Supprimer"
                                        >
                                          <FiXCircle className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100/50 text-center">
                          <Link
                            href="/notifications"
                            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                            onClick={() => setIsNotifOpen(false)}
                          >
                            Voir toutes les notifications
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bouton Retour */}
              <button
                onClick={() => router.push("/user")}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <FiArrowLeft className="text-primary text-sm" />
                </div>
                <span className="text-sm">Retour</span>
              </button>

              {/* Bouton Menu Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-16 left-0 bottom-0 w-72 bg-white shadow-xl z-30 lg:hidden overflow-y-auto"
          >
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                        ${isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className={`text-lg ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                      <div>
                        <div className="text-sm">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeDot"
                          className="ml-auto w-1.5 h-8 bg-primary rounded-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                >
                  <FiLogOut className="text-lg" />
                  <span>Déconnexion</span>
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout principal */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="flex gap-8">
            {/* Sidebar desktop */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)]"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full">
                <nav className="space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link href={item.href}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                              ${isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-foreground'
                              }
                            `}
                          >
                            <div className={`
                              w-9 h-9 rounded-lg flex items-center justify-center
                              ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
                            `}>
                              <Icon className="text-base" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-gray-400">{item.description}</div>
                            </div>
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="ml-auto w-1 h-8 bg-primary rounded-full"
                              />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}

                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red/10 flex items-center justify-center">
                        <FiLogOut className="text-base" />
                      </div>
                      <span>Déconnexion</span>
                    </motion.button>
                  </div>
                </nav>
              </div>
            </motion.aside>

            {/* Contenu principal */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 min-w-0"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8">
                  {children}
                </div>
              </div>
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  );
}