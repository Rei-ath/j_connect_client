import { useEffect } from 'react';

export function useWebSocket() {
    useEffect(() => {
        const socket = new WebSocket('ws://192.168.0.115:5000');

        socket.addEventListener('error', async (e) => console.log(e));
        socket.addEventListener('open', async () => socket.send('mew mew nigga'));

        socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        });
    }, []);
}
