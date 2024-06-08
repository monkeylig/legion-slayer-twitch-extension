import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button';
import BagObjectButton from '@/components/object-viewers/bag-object-button';

import pageStyles from '@/styles/pages.module.css'
import bagStyles from '@/styles/bag.module.css'
import frontendContext from '@/utilities/frontend-context';
import backend from '@/utilities/backend-calls';
import { useState } from 'react';
import ClaimObjectButton from '@/components/object-viewers/claim-object-button';
import { useNavigate } from 'react-router-dom';

export default function Bag() {
    const navigate = useNavigate();
    const [player, setPlayer] = useState(frontendContext.get().player);
    if (!player) {
        return;
    }

    const moveObject = (objectId) => {
        backend.moveObjectFromBagToInventory(player.id, objectId)
        .then(player => {
            setPlayer(player);
        })
        .catch(error => {});
    };

    const claimObject = (objectId) => {
        backend.claimObject(player.id, objectId)
        .then(player => {
            setPlayer(player);
        })
        .catch(error => {});
    };

    const bagButtons = player.bag.objects.map(bagObject => {
        const urlObject = {
            object: bagObject,
            mode: 'bag'
        };
        return <BagObjectButton tilt={bagObject.type === 'weapon'} label={bagObject.content.name} imageSrc={bagObject.content.icon} key={bagObject.id}
        onMoveClicked={() => {moveObject(bagObject.id);}} onClick={()=>{ navigate('/panel/object-view', { state: urlObject }); }}/>
    });

    for(let i=0; i < Math.max(0, player.bag.capacity - player.bag.objects.length); i++) {
        bagButtons.push(<BagObjectButton empty key={i}/>);
    }

    const unclaimedButtons = player.lastDrops.objects.map(object => {
        const urlObject = {
            object: object,
            mode: 'claim'
        };
        return (
            <ClaimObjectButton tilt={object.type === 'weapon'} label={object.content.name} imageSrc={object.content.icon} key={object.id}
                onClaimClicked={() => {claimObject(object.id);}} onClick={()=>{ navigate('/panel/object-view', { state: urlObject }); }}/>
        );
    });

    return (
        <>
            <Head>
                <title>Bag</title>
                <meta name="description" content="A place where players can manage their bag." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{gap: '15px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Bag' onBackClicked={() => { navigate(-1); }}/>
                <div className={`${bagStyles['bag-viewer']}`}>
                    {bagButtons}
                </div>
                {unclaimedButtons.length > 0 &&
                    <div className={bagStyles['claim-viewer']}>
                        <span>Drops from the last battle</span>
                        <div className={bagStyles['unclaimed-objects']}>
                            {unclaimedButtons}
                        </div>
                    </div>
                }
            </div>
            <div style={{height: '80px'}}/>
            <Button className={`${bagStyles['inventory-btn']} material-symbols-outlined`} onClick={() => { navigate('/panel/inventory', {state: {page: 0}}); }}>inventory_2</Button>
        </>
    );
}