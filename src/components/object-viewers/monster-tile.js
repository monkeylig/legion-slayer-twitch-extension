import monsterTileStyles from '@/components/object-viewers/monster-tile.module.css'

import Image from "next/image";

export default function MonsterTile() {
    return (
        <div className={`${monsterTileStyles['monster-tile']}`}>
            <div className={`${monsterTileStyles['monster-tile-avatar']}`}>
                <Image src={'abyssal.webp'} fill/>
            </div>
            <div>Lvl 30</div>
            <div>Abyssal</div>
        </div>
    );
}