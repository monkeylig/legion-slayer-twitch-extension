// @ts-check

/**
 * @import {GameGuide, GuideArticle} from "@/utilities/backend-calls"
 */

import { useNavigate } from "react-router";
import HeaderBarBack from "../header-bar/header-bar-back";
import Image from "next/image";
import Head from "next/head";

import pageStyles from '@/styles/pages.module.css'
import guideStyles from '@/styles/game-guide.module.css'
import KeywordText from "../text/keyword-text";
import useAsync from "@/utilities/useAsync";
import backend from "@/utilities/backend-calls";
import LoadingScreen from "../loading/loading-screen";
import ButtonTag from "../button/button-tag";

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
                <GameGuideTopics/>
                <h2>Key Terms</h2>
                <AllKeywords/> 
            </div>
        </>
    );
}

function GameGuideTopics({}) {
    const [data, isPending, error] = useAsync(backend.getGameGuide);
    const gameGuide = backend.cache.gameGuide;
    const pendingUI = gameGuide ? <RenderGameGuideList data={gameGuide}/> : <LoadingScreen/>;

    return (
        <div>
            {isPending && pendingUI}
            {data && <RenderGameGuideList data={data}/>}
            {error && <p>Sorry something went wrong. Try refreshing the page.</p>}
        </div>
    );
}

/**
 * 
 * @param {{
 *     data: GameGuide
 * }} attributes 
 */
function RenderGameGuideList({data}) {
    if (!data) {return;}

    const topics = data.articles.map((article) => {
        return <GuideArticle key={article.title} data={article}/>;
    });

    return (
        <div className={guideStyles['game-guide-list']}>
            {topics}
        </div>
    );
}

/**
 * 
 * @param {{
 *     data: GuideArticle
 * }} attributes 
 * @returns 
 */
function GuideArticle({data}) {
    const navigate = useNavigate();

    const goToArticle = () => {
        const navState = {
            data: data
        };
        navigate('/panel/game-guide-article', { state: navState });
    };
    return (
        <ButtonTag className={guideStyles['game-guide-topic']} onClick={goToArticle}>
            <div>{data.title}</div>
            <div className={guideStyles['game-guide-topic-thumbnail']}>
                <Image fill alt="game guide topic thumbnail" src={data.thumbnail}></Image>
            </div>
        </ButtonTag>
    );
}

function AllKeywords({}) {
    return (
        <>
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
        </>
    );
}
