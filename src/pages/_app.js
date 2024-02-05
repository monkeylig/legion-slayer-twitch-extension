import '@/styles/globals.css'
import frontendContext from '@/utilities/frontend-context';
import { Zen_Dots } from 'next/font/google'
import { useEffect } from 'react';

const zenDots = Zen_Dots({
  weight: '400',
  subsets: ['latin'],
})

export default function App({ Component, pageProps }) {
  useEffect(() => {
    console.log(process.env.NODE_ENV);
    window.Twitch.ext.onAuthorized((auth) => {
      const accountId = window.Twitch.ext.viewer.id ? window.Twitch.ext.viewer.id : auth.userId;
      frontendContext.update(accountId, auth.channelId, auth.token);
    });
  }, []);

  return (
    <main className={zenDots.className}>
        <Component {...pageProps} />
    </main>
    );
}
