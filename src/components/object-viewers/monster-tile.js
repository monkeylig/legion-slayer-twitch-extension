import monsterTileStyles from '@/components/object-viewers/monster-tile.module.css'

import Image from "next/image";

export default function MonsterTile({monster={}, onClick, priority=false}) {
    return (
        <button className={`${monsterTileStyles['monster-tile']}`} onClick={onClick}>
            <div className={monsterTileStyles['effect']}/>
            <div className={`${monsterTileStyles['monster-tile-avatar']}`}>
                <Image sizes='148px' src={monster.avatar} alt='Monster tile show an image of a monster and its stats.' fill priority={priority}/>
                <div className={monsterTileStyles['monster-info']}>
                    <div>{monster.name}</div>
                    <div style={{fontSize: '12px'}}>Lvl {monster.level}</div>
                </div>
            </div>
        </button>
    );
}