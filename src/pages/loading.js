import Head from 'next/head'
import Image from 'next/image'
import HeaderBar from '@/components/header-bar/header-bar'
import pageStyles from '@/styles/pages.module.css'
import { useEffect } from 'react'
import frontendContext from '@/utilities/frontend-context'
import backend from '@/utilities/backend-calls'
import { useRouter } from 'next/router'

export default function Loading() {
    const router = useRouter();
    useEffect(() => {
        frontendContext.wait()
        .then(() => {
            const context = frontendContext.get();
            backend.getPlayer(context.accountId, 'twitch')
            .then((player) => {
                frontendContext.setPlayer(player);
                router.push('/game');
            })
            .catch((error) => {
                if(error.errorCode === 2) {
                    router.push('/signup');
                }
            });
        });
    }, []);
    return (
        <>
            <Head>
                <title>Loading Legion Slayer</title>
                <meta name="description" content="Loading screen for Legion Slayer" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={pageStyles['page-container-h-center']}>
                <HeaderBar title='Loading'/>
                <div className={pageStyles['page-container-v-center']}>
                    <p>Loading Legion Slayer...</p>
                </div>
            </div>
        </>
    )
}
