// contexts/WebSocketContext.jsx
'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);

    const connect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const wsUrl = `ws://localhost:8000/ws/notifications/`;
            
            
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                
                setIsConnected(true);
                if (reconnectTimerRef.current) {
                    clearTimeout(reconnectTimerRef.current);
                    reconnectTimerRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    

                    // ⭐ AJOUTER LA NOTIFICATION DANS LE TABLEAU
                    if (data.type === 'forum_created') {
                        setNotifications(prev => [{
                            id: Date.now(), // ID unique
                            forum: data.data,
                            message: data.message,
                            timestamp: new Date().toISOString(),
                            read: false
                        }, ...prev]);
                    }
                } catch (error) {
                    console.error('❌ Erreur parsing:', error);
                }
            };

            ws.onclose = () => {
                
                setIsConnected(false);
                
                reconnectTimerRef.current = setTimeout(() => {
                    console.log('🔄 Reconnexion...');
                    connect();
                }, 3000);
            };

            ws.onerror = (error) => {
                console.error('❌ Erreur WebSocket:', error);
                ws.close();
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('❌ Erreur connexion:', error);
        }
    };

    const disconnect = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
            setIsConnected(false);
        }
    };

    // ⭐ MARQUER UNE NOTIFICATION COMME LUE
    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
    };

    // ⭐ SUPPRIMER UNE NOTIFICATION
    const removeNotification = (notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    };

    // ⭐ VIDER TOUTES LES NOTIFICATIONS
    const clearAllNotifications = () => {
        setNotifications([]);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            connect();
        }
        return () => disconnect();
    }, []);

    return (
        <WebSocketContext.Provider value={{
            isConnected,
            notifications,
            markAsRead,
            removeNotification,
            clearAllNotifications
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};