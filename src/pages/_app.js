import '@/styles/globals.css'
import { Zen_Dots } from 'next/font/google'

const zenDots = Zen_Dots({
  weight: '400',
  subsets: ['latin'],
})

export default function App({ Component, pageProps }) {
  return (
    <main className={zenDots.className}>
        <Component {...pageProps} />
    </main>
    );
}
