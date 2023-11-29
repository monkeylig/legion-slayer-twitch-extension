import Head from "next/head";
import battleStyle from "@/styles/battle.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import LabeledMeterBar from "@/components/meter-bar/labeled-meter-bar";
import { useState } from "react";
import Button from "@/components/button/button";
import colors from "@/utilities/colors";

export default function Battle() {
    const [controlMode, setControlMode] = useState('battle');
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
                    {controlMode === 'battle' && <BattleControls player={battleState.player}/>}
                </div>
                <div className={battleStyle['options']}>
                    <Button className={battleStyle['options-btn']}>Escape</Button>
                    <Button className={battleStyle['options-btn']}>Items</Button>
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

function BattleControls({player}) {
    if (!player) {
        return;
    }
    const strikeButtonStyle = {
        background: 'var(--foreground-rgb)',
        color: 'black'
    };

    const abilityButtons = player.abilities.map((ability, index) => {
        const style = {
            background: colors.getElementalColor(ability.elements[0])
        };
        return <Button style={style} className={battleStyle['battle-btn']}>{ability.name}</Button>;
    });
    return (
        <div className={battleStyle['battle-controls']}>
            <div className={battleStyle['battle-controls-frame']}>
                <Button style={strikeButtonStyle} className={battleStyle['battle-btn']}>Strike</Button>
                {abilityButtons}
            </div>
        </div>
    )
}

function TypeWriter({}) {

}