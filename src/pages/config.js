import Head from 'next/head'

import HeaderBar from '@/components/header-bar/header-bar'
import Button from '@/components/button/button'
import Select from '@/components/select/select'

import pageStyles from '@/styles/pages.module.css'
import AsyncButton from '@/components/button/async-button'
import backend from '@/utilities/backend-calls'
import { useCallback, useEffect, useRef, useState } from 'react'
import frontendContext from '@/utilities/frontend-context'
import useAsync from '@/utilities/useAsync'

export default function Config() {
    const getGame = useCallback(async () => {
        await frontendContext.wait();
        const game = await backend.getGame(frontendContext.get().channelId);
        return game;
    }, []);
    const [data, isPending, error] = useAsync(getGame);
    
    return (        
        <div>
            {isPending && <h1>Config...</h1>}
            {data && <ConfigRender game={data}/>}
            {error && <ConfigRender game={{mode: 'auto'}}/>}
        </div>
    );
}

function ConfigRender({game}) {

    const onApply = async () => {
        const gameModeOption = document.getElementById('gameMode');
        const gameMode = gameModeOption.value;
        await backend.updateGame(frontendContext.get().channelId, gameMode);
    };

    return (
        <>
            <Head>
                <title>Config</title>
                <meta name="description" content="A page where streamers can change the settings for their game." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{gap: '15px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBar title='Config'/>
                <div>
                    <label style={{paddingRight: '5px'}} htmlFor="gameMode">Game Mode</label>
                    <Select name='gameModeSelect' id='gameMode' defaultValue={game.mode}>
                        <option value='auto'>Auto</option>
                        <option value='arena'>Arena</option>
                        <option value='battleRoyale'>Battle Royale</option>
                    </Select>
                </div>
                <AsyncButton style={{background: 'var(--green)'}} onClick={onApply}>Apply</AsyncButton>
            </div>
        </>
    )
}
