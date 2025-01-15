import Head from 'next/head'
import Image from 'next/image'
import HeaderBar from '@/components/header-bar/header-bar'
import pageStyles from '@/styles/pages.module.css'
import { useCallback, useEffect, useState } from 'react'
import frontendContext from '@/utilities/frontend-context'
import backend from '@/utilities/backend-calls'
import Button from '@/components/button/button'
import colors from '@/utilities/colors'
import { useLocation, useNavigate } from "react-router"
import LoadingScreen from '../loading/loading-screen'

export default function Loading() {
    const navigate = useNavigate();
    const [accountStatus, setAccountStatus] = useState('loading');
    const [viewerId, setViewerId] = useState();

    const tryGoToGame = useCallback(() => {
        const context = frontendContext.get();
        backend.getPlayer(context.accountId, 'twitch')
        .then((player) => {
            frontendContext.setPlayer(player);
            navigate('/panel/game');
        })
        .catch((error) => {
            if(error.errorCode === 2) {
                navigate('/panel/signup');
            }
        });
    }, [navigate]);

    useEffect(() => {
            if (viewerId === undefined) {
                return;
            }

            if(!frontendContext.viewerId) {
                setAccountStatus('anonymous');
                window.Twitch.ext.actions.requestIdShare();
            }
            else {
                tryGoToGame();
            }
    }, [viewerId, tryGoToGame]);

    useEffect(() => {
        frontendContext.wait().then(() => {
            setViewerId(frontendContext.viewerId);
        });
        frontendContext.onContextUpdated(() => {
            setViewerId(frontendContext.viewerId);
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
                {accountStatus === 'loading' && <LoadingScreen/>}
                {accountStatus === 'anonymous' && 
                    <div className={pageStyles['page-container-v-center']}>
                        <Button style={{background: colors.blue, marginTop: '10px'}} onClick={continueClick}>Play Anonymously</Button>
                        <p>Progress may not be saved</p>
                    </div>}
            </div>
        </>
    )
}
