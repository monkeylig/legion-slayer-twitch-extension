import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button';
import BagObjectButton from '@/components/object-viewers/bag-object-button';

import pageStyles from '@/styles/pages.module.css'
import bagStyles from '@/styles/bag.module.css'
import { useRouter } from 'next/router';
import frontendContext from '@/utilities/frontend-context';
import backend from '@/utilities/backend-calls';
import { useState } from 'react';

export default function Bag() {
    const router = useRouter();
    const [player, setPlayer] = useState(frontendContext.get().player);

    const moveObject = (objectId) => {
        backend.moveObjectFromBagToInventory(player.id, objectId)
        .then(player => {
            setPlayer(player);
        })
        .catch(error => {});
    };

    const bagButtons = player.bag.objects.map(bagObject => {
        const urlObject = {
            pathname: '/object-view',
            query: {
                object: JSON.stringify(bagObject),
                mode: 'bag'
            }
        };
        return <BagObjectButton tilt={bagObject.type === 'weapon'} label={bagObject.content.name} imageSrc={bagObject.content.icon} key={bagObject.id}
        onMoveClicked={() => {moveObject(bagObject.id);}} onClick={()=>{router.push(urlObject)}}/>
    });

    for(let i=0; i < Math.max(0, player.bag.capacity - player.bag.objects.length); i++) {
        bagButtons.push(<BagObjectButton empty key={i}/>);
    }

    return (
        <>
            <Head>
                <title>Bag</title>
                <meta name="description" content="A place where players can manage their bag." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{gap: '15px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Bag' onBackClicked={() => { router.back(); }}/>
                <div className={`${bagStyles['bag-viewer']}`}>
                    {bagButtons}
                </div>
            </div>
            <Button className={`${bagStyles['inventory-btn']} material-symbols-outlined`} onClick={() => {router.push('/inventory')}}>inventory_2</Button>
        </>
    );
}