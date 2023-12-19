import Head from 'next/head'
import Image from 'next/image'
import HeaderBar from '@/components/header-bar/header-bar'
import pageStyles from '@/styles/pages.module.css'
import { useEffect, useState } from 'react'
import frontendContext from '@/utilities/frontend-context'
import backend from '@/utilities/backend-calls'
import { useRouter } from 'next/router'
import Button from '@/components/button/button'
import colors from '@/utilities/colors'

export default function Loading() {
    const router = useRouter();
    const [viewerId, setViewerId] = useState(null);

    const tryGoToGame = () => {
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
    };

    useEffect(() => {
        frontendContext.wait()
        .then(() => {
            setViewerId()
            if(!window.Twitch.ext.viewer.id) {
                window.Twitch.ext.actions.requestIdShare();
            }
            else {
                tryGoToGame();
            }
        });
    }, [viewerId]);

    useEffect(() => {
        frontendContext.onContextUpdated(() => {
            setViewerId(window.Twitch.ext.viewer.id);
        });
    }, []);

    const continueClick = () => {
        frontendContext.wait()
        .then(() => {
            tryGoToGame();
        });
    }
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
                    <Button style={{background: colors.blue, marginTop: '10px'}} onClick={continueClick}>Play Anonymously</Button>
                    <p>Progress may not be saved</p>
                </div>
            </div>
        </>
    )
}
