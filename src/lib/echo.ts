import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Ensure TypeScript recognizes Pusher globally
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'reverb'>;
  }
}
window.Pusher = Pusher;
window.Echo = new Echo<'reverb'>({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY as string, // Explicitly cast environment variable
  authorizer: (channel) => {
    return {
      authorize: (socketId: string, callback: (error: Error | null, data: any) => void) => {
        axios
          .post("http://localhost:8089/api/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          },{
                headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
            })
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            callback(error instanceof Error ? error : new Error(String(error)), null);
          });
      },
    };
  },
  wsHost: import.meta.env.VITE_REVERB_HOST as string,
  wsPort: (import.meta.env.VITE_REVERB_PORT as unknown as number) ?? 80,
  wssPort: (import.meta.env.VITE_REVERB_PORT as unknown as number) ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
});
export default window.Echo;