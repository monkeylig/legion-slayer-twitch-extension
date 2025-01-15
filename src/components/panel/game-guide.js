import { useNavigate } from "react-router";
import HeaderBarBack from "../header-bar/header-bar-back";
import Head from "next/head";

import pageStyles from '@/styles/pages.module.css'
import KeywordText from "../text/keyword-text";

export default function GameGuide({}) {
    const navigate = useNavigate();
    return (
        <>
            <Head>
                <title>Game Guide</title>
                <meta name="description" content="Learn all there is to know about Legion Slayer." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="./favicon.webp" />
            </Head>
            <div style={{gap: '15px', paddingBottom: '20px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Game Guide' onBackClicked={ () => { navigate(-1); } }/>
                <h2>Key Terms</h2>
                <KeywordText>Imbue</KeywordText>
                <KeywordText>Priority</KeywordText>
                <KeywordText>Physical Empowerment</KeywordText>
                <KeywordText>Magical Empowerment</KeywordText>
                <KeywordText>Physical Protection</KeywordText>
                <KeywordText>Magical Protection</KeywordText>
                <KeywordText>Fire Resistance</KeywordText>
                <KeywordText>Lightning Resistance</KeywordText>
                <KeywordText>Water Resistance</KeywordText>
                <KeywordText>Ice Resistance</KeywordText>
                <KeywordText>Surged</KeywordText>
                <KeywordText>Ablazed</KeywordText>
                <KeywordText>Drenched</KeywordText>
                <KeywordText>Frozen</KeywordText>
                <KeywordText>Weapon speed</KeywordText>
                <KeywordText>AP</KeywordText>
                <KeywordText>HP</KeywordText>
                <KeywordText>Base Damage</KeywordText>
                <KeywordText>Strike</KeywordText>
                <KeywordText>Strike Ability</KeywordText>
                <KeywordText>Recoil Damage</KeywordText>
                <KeywordText>Element Fusion</KeywordText>
            </div>
        </>
    );
}