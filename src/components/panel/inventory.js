import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button'
import Select from '@/components/select/select'

import pageStyles from '@/styles/pages.module.css'
import inventoryStyles from '@/styles/inventory.module.css'
import BagObjectButton from '@/components/object-viewers/bag-object-button'
import InventoryObjectButton from '@/components/object-viewers/inventory-object-button'
import { useCallback, useEffect, useState } from 'react'
import frontendContext from '@/utilities/frontend-context'
import backend from '@/utilities/backend-calls'
import useAsync from '@/utilities/useAsync'
import { useLocation, useNavigate } from "react-router";
import LoadingScreen from '@/components/loading/loading-screen';
import ObjectButton from '../object-viewers/object-button'

export default function Inventory() {
    const navigate = useNavigate();
    const [player, setPlayer] = useState(frontendContext.get().player);
    const location = useLocation();
    const [pageData, setPageData] = useState({objects: []});
    const [pageDataRequest, setPageDataRequest] = useState('pending');

    const currentPage = location.state.page ? location.state.page : 0;
    const leger = player.inventory.leger;
    const currentPageId = leger[currentPage] ? leger[currentPage].id : '';
    const bagFull = player.bag.objects.length >= player.bag.capacity;
    const playerId = player.id;
    
    const refreshPage = useCallback(() => {
        setPageDataRequest('pending');
        if (!leger[currentPage]) {
            setPageDataRequest('complete');
            return;
        }
        backend.getInventoryPage(playerId, leger[currentPage].id)
        .then(page => {
            setPageDataRequest('complete');
            setPageData(page);
        })
        .catch(error => {
            setPageDataRequest('error');
        });
    }, [currentPage, leger, playerId]);

    useEffect(() => {
        refreshPage();
    }, [currentPage, player.inventory.leger.length, refreshPage]);

    const moveObjectToInventory = async (objectId) => {
        const collections = await backend.moveObjectFromBagToInventory(player.id, objectId);
        setPlayer(collections.player);
        setPageData(collections.page);
    };

    const moveObjectToBag = async (objectId) => {
        if(bagFull) {
            throw new Error("Bag is full");
        }
        const collections = await backend.moveObjectFromInventoryToBag(player.id, player.inventory.leger[currentPage].id, objectId);
        setPlayer(collections.player);
        setPageData(collections.page);
    };
    
    const weaponViewObject = {
        object: {
            type: 'weapon',
            content: player.weapon
        },
        mode: 'bag'
    };
    const bagButtons = [<ObjectButton key={'equipped'} bagObject={{content: player.weapon}} tag="equipped" className={inventoryStyles['bag-item']} 
        onClick={() => { navigate('/panel/object-view', { state: weaponViewObject }); }} />];

    bagButtons.push(...player.bag.objects.map(bagObject => {
        const urlObject = {
            object: bagObject,
            mode: 'bag'
        };
        const onClick = () => {
            navigate('/panel/object-view', { state: urlObject });
        };
        return <BagObjectButton bagObject={bagObject} key={bagObject.id} className={inventoryStyles['bag-item']}
        onMoveClicked={async () => { await moveObjectToInventory(bagObject.id)}} onClick={onClick}/>;
    }));

    for(let i=0; i < Math.max(player.bag.capacity - player.bag.objects.length); i++) {
        bagButtons.push(<BagObjectButton empty key={i} className={inventoryStyles['bag-item']}/>);
    }

    const movePage = (value) => {
        const nextPage = Math.min(player.inventory.leger.length - 1, Math.max(0, currentPage + value));

        if (player.inventory.leger.length === 0 || nextPage === currentPage) {
            return;
        }

        setPageData({objects: []});
        navigate('/panel/inventory', {
            state: {page: nextPage},
            replace: true
        });
    }

    const pendingUi = backend.cache.inventory[currentPageId] ? <RenderInventory pageData={backend.cache.inventory[currentPageId]}/> : <LoadingScreen/>;
    return (
        <>
            <Head>
                <title>Inventory</title>
                <meta name="description" content="Move objects to and from your inventory and bag." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Inventory' onBackClicked={ () => { navigate(-1); } }/>
                {bagFull && <div className={inventoryStyles['bag-full-notification']}>Bag Full</div>}
                <div className={inventoryStyles['inventory-view']}>
                    <div className={inventoryStyles['bag-controls']}>
                        Preview<Button className={inventoryStyles['bag-button']} onClick={() => { navigate('/panel/bag') }}>Open Bag</Button>
                    </div>
                    <div className={inventoryStyles['bag-preview']}>
                        {bagButtons}
                    </div>
                    <div className={inventoryStyles['inventory-container']}>
                        {pageDataRequest === 'pending' && pendingUi}
                        {pageDataRequest === 'error' && <h1>Sorry, there was a problem loading the page</h1>}
                        {pageDataRequest === 'complete' &&  <RenderInventory pageData={pageData} bagFull={bagFull} onAddClicked={moveObjectToBag}/>}
                    </div>
                </div>
                <div className={inventoryStyles['page-nav']}>
                    <Button className={`${inventoryStyles['left-page-nav']} material-symbols-outlined`} onClick={() => {movePage(-1)}}>arrow_back</Button>
                    <div className={inventoryStyles['page-tracker']}>{player.inventory.leger.length > 0 ? currentPage + 1 : 0}/{player.inventory.leger.length}</div>
                    <Button className={`${inventoryStyles['right-page-nav']} material-symbols-outlined`} onClick={() => {movePage(1)}}>arrow_forward</Button>
                </div>
                <div style={{height: '80px'}}/>
            </div>
        </>
    );
}

/**
 * 
 * @param {{
 * pageData: Object[],
 * bagFull: boolean,
 * onAddClicked: (objectId: string) => Promise,
 * }} attributes 
 * @returns 
 */
function RenderInventory({pageData, bagFull=false, onAddClicked}) {
    const navigate = useNavigate();

    if (!pageData) {
        return;
    }

    const pageObjectButtons = pageData.objects.map(pageObject => {
        const urlObject = {
            object: pageObject,
            mode: 'inventory',
            pageId: pageData.id
        };
        return <InventoryObjectButton disableAdd={bagFull} pageObject={pageObject} key={pageObject.id} onAddClicked={async () => {await onAddClicked(pageObject.id);}}
        onClick={()=>{ navigate('/panel/object-view', { state: urlObject }); }}/>;
    });

    return <>{pageObjectButtons}</>;
}