import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_group_name = 'notifications'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'connection',
            'message': 'Connecté au serveur de notifications',
            'status': 'connected'
        }))
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            
            if data.get('type') == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'message': 'Connection active'
                }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'echo',
                    'data': data,
                    'message': f'Message reçu'
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Format de message invalide'
            }))
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    
    async def forum_created(self, event):
        """Envoyer la notification de nouveau forum à tous les talents"""
        forum_data = event['forum_data']
        
        await self.send(text_data=json.dumps({
            'type': 'forum_created',
            'data': forum_data,
            'message': f"🎉 Nouveau forum disponible : {forum_data['nom']}",
            'timestamp': forum_data.get('created_at', '')
        }))