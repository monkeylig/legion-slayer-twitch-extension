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
    /*window.Twitch.ext.onAuthorized((auth) => {
      frontendContext.update(auth.userId, auth.channelId);
    });*/
  }, []);

  return (
    <main className={zenDots.className}>
        <Component {...pageProps} />
    </main>
    );
}
