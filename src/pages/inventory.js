import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button'
import Select from '@/components/select/select'

import pageStyles from '@/styles/pages.module.css'
import inventoryStyles from '@/styles/inventory.module.css'
import BagObjectButton from '@/components/object-viewers/bag-object-button'
import InventoryObjectButton from '@/components/object-viewers/inventory-object-button'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import frontendContext from '@/utilities/frontend-context'
import backend from '@/utilities/backend-calls'
import useAsync from '@/utilities/useAsync'

export default function Inventory() {
    const router = useRouter();
    const [player, setPlayer] = useState(frontendContext.get().player);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageData, setPageData] = useState({objects: []});

    const bagFull = player.bag.objects.length >= player.bag.capacity;
    const refreshPage = (_player=player) => {    
        backend.getInventoryPage(_player.id, _player.inventory.leger[currentPage].id)
        .then(page => {
            setPageData(page);
        })
        .catch(error => {});
    };
    useEffect(() => {
        if(player.inventory.leger.length <= currentPage) {
            return;
        }

        refreshPage();
    }, [currentPage]);

    const moveObjectToInventory = objectId => {
        backend.moveObjectFromBagToInventory(player.id, objectId)
        .then(player => {
            setPlayer(player);
            refreshPage(player);
        })
        .catch(error => {});
    };

    const moveObjectToBag = objectId => {
        if(bagFull) {
            return;
        }
        backend.moveObjectFromInventoryToBag(player.id, player.inventory.leger[currentPage].id, objectId)
        .then(collections => {
            setPlayer(collections.player);
            setPageData(collections.page);
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
        className={inventoryStyles['bag-item']} onMoveClicked={() => {moveObjectToInventory(bagObject.id)}} onClick={()=>{router.push(urlObject)}}/>;
    });

    for(let i=0; i < Math.max(player.bag.capacity - player.bag.objects.length); i++) {
        bagButtons.push(<BagObjectButton empty key={i} className={inventoryStyles['bag-item']}/>);
    }

    const pageObjectButtons = pageData.objects.map(pageObject => {
        const urlObject = {
            pathname: '/object-view',
            query: {
                object: JSON.stringify(pageObject),
                mode: 'inventory',
                pageId: pageData.id
            }
        };
        return <InventoryObjectButton tilt={pageObject.type === 'weapon'} label={pageObject.content.name} imageSrc={pageObject.content.icon} key={pageObject.id}
        onAddClicked={() => moveObjectToBag(pageObject.id)} onClick={()=>{router.push(urlObject)}}/>;
    });

    const movePage = (value) => {
        setCurrentPage((lastPage) => {
            return Math.min(player.inventory.leger.length - 1, Math.max(0, lastPage + value));
        });
    }

    return (
        <>
            <Head>
                <title>Inventory</title>
                <meta name="description" content="Move objects to and from your inventory and bag." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Inventory' onBackClicked={router.back}/>
                {bagFull && <div className={inventoryStyles['bag-full-notification']}>Bag Full</div>}
                <div className={inventoryStyles['page-nav']}>
                    <Button className={`${inventoryStyles['left-page-nav']} material-symbols-outlined`} onClick={() => {movePage(-1)}}>arrow_back</Button>
                    <div className={inventoryStyles['page-tracker']}>{player.inventory.leger.length > 0 ? currentPage + 1 : 0}/{player.inventory.leger.length}</div>
                    <Button className={`${inventoryStyles['right-page-nav']} material-symbols-outlined`} onClick={() => {movePage(1)}}>arrow_forward</Button>
                </div>
                <div className={inventoryStyles['inventory-view']}>
                    <div>Bag</div>
                    <div className={inventoryStyles['bag-preview']}>
                        {bagButtons}
                    </div>
                    <div className={inventoryStyles['inventory-container']}>
                        {pageObjectButtons}
                    </div>
                </div>
                <div style={{height: '80px'}}/>
            </div>
        </>
    )
}