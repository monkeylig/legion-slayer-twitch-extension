// @ts-check

/**
 * @import {GuideArticle, GuideEntry, GuideTopic} from "@/utilities/backend-calls"
 */

import { useNavigate, useLocation } from "react-router";
import Head from "next/head";

import pageStyles from '@/styles/pages.module.css'
import articleStyles from '@/styles/game-guide-article.module.css'
import HeaderBarBack from "../header-bar/header-bar-back";
import KeywordText from "../text/keyword-text";

export default function GameGuideArticlePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const data = location.state.data; 

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
                <GameGuideArticle data={data}/>
            </div>
        </>
    );   
}

/**
 * 
 * @param {{
 *     data: GuideArticle
 * }} attributes 
 */
function GameGuideArticle({data}) {
    if (!data) {return;}

    const topics = data.topics.map((topic) => {
        return (
            <>
                <GameGuideTopic key={topic.title} data={topic}/>
            </>
        );
    });
    return (
        <div className={articleStyles['article']}>
            <div className={articleStyles['article-title']}>{data.title}</div>
            <KeywordText>{data.summary}</KeywordText>
            {topics}
        </div>
    );
}

/**
 * 
 * @param {{
 *     data: GuideTopic
 * }} attributes 
 */
function GameGuideTopic({data}) {
    if (!data) {return;}

    let subTopics = [];
    if (data.subTopics) {
        subTopics = data.subTopics.map((entry) => {
            return <GameGuideSubTopic key={entry.title} data={entry}/>;
        });
    }

    return (
        <>
            <div className={articleStyles['article-title']}>{data.title}</div>
            <KeywordText>{data.content}</KeywordText>
            {subTopics}
        </>
    );
}

/**
 * 
 * @param {{
 *     data: GuideEntry
 * }} attributes 
 */
function GameGuideSubTopic({data}) {
    if (!data) {return;}

    return (
        <>
            <div>{data.title}</div>
            <KeywordText>{data.content}</KeywordText>
        </>
    );
}
