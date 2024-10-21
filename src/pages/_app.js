import '@/styles/globals.css'
import frontendContext from '@/utilities/frontend-context';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
    // useEffect(() => {
    //     window.Twitch.ext.onAuthorized((auth) => {
    //         const accountId = window.Twitch.ext.viewer.id ? window.Twitch.ext.viewer.id : auth.userId;
    //         frontendContext.update(accountId, auth.channelId, auth.token);
    //     });
    // }, []);
    
    frontendContext.update("963595820", 'test');
    return (
        <main>
            <Component {...pageProps} />
        </main>
    );
}
