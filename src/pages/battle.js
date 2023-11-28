import Head from "next/head";
import battleStyle from "@/styles/battle.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import LabeledMeterBar from "@/components/meter-bar/labeled-meter-bar";

export default function Battle() {
    const router = useRouter();
    const battleState = JSON.parse(router.query.battleState);
    return (
        <>
            <Head>
                <title>Battle</title>
                <meta name="description" content="Player fights a monster." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={battleStyle['battle']}>
                <div className={battleStyle['battle-zone']}>
                    <Image fill src="tropic-battle.webp"></Image>
                    <div className={battleStyle['header']}>
                        <BattleHeader player={battleState.player}/>
                        <BattleHeader player={battleState.monster}/>
                    </div>
                    <div className={battleStyle['avatars']}>
                        <BattleAvatar player={battleState.player} showAP/>
                        <BattleAvatar player={battleState.monster}/>
                    </div>
                </div>
                <div className={battleStyle['controls']}>

                </div>
                <div className={battleStyle['options']}>

                </div>
            </div>
        </>
    );
}


function BattleHeader({player}) {

    const levelStyle = {
        fontSize: '12px',
        textAlign: 'center'
    };
    return (
        <div className={battleStyle['battle-header']}>
            <span className={battleStyle['battle-header-name']}>{player.name}</span>
            <span style={levelStyle}>Level {player.level}</span>
        </div>
    );
}

function BattleAvatar({player, showAP}) {
    return (
        <div className={battleStyle['battle-avatar']}>
            <Image fill src={player.avatar} className={battleStyle['avatar-image']}/>
            <LabeledMeterBar progress={player.health/player.maxHealth} className={battleStyle['avatar-health-bar']}>{player.health}</LabeledMeterBar>
            {showAP && <APTracker apNumber={player.ap}/>}
        </div>
    );
}

function APTracker({apNumber}) {
    const maxAp = 3;
    const apTextStyle = {
        textAlign: 'center',
        fontSize: '12px'
    };

    const apNodes = [];
    for(let i = 0; i < maxAp; i++) {
        let className = battleStyle['ap-node-empty'];
        if(apNumber > i) {
            className = battleStyle['ap-node'];
        }
        apNodes.push(<div className={className} key={i}/>);
    }
    return (
        <div className={battleStyle['ap-tracker']}>
            <span style={apTextStyle}>AP</span>
            <div className={battleStyle['ap-bar']}>
                {apNodes}
            </div>
        </div>
    );
}