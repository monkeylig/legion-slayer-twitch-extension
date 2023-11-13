import Head from 'next/head'

import HeaderBar from '@/components/header-bar/header-bar'
import Button from '@/components/button/button'
import Select from '@/components/select/select'

import pageStyles from '@/styles/pages.module.css'

export default function Config() {
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
                    <Select name='gameModeSelect' id='gameMode'>
                        <option value='auto'>Auto</option>
                        <option value='area'>Arena</option>
                        <option value='battleRoyale'>Battle Royale</option>
                    </Select>
                </div>
                <Button style={{background: 'var(--red)'}}>Reset Game</Button>
            </div>
        </>
    )
}