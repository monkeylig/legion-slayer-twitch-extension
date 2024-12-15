import Head from 'next/head'
import { useEffect, useState } from 'react';

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Select from '@/components/select/select';

import pageStyles from '@/styles/pages.module.css'
import shopStyles from '@/styles/shop.module.css'
import ShopItemButton from '@/components/object-viewers/shop-item-button';
import useAsync from '@/utilities/useAsync';
import backend from '@/utilities/backend-calls';
import frontendContext from '@/utilities/frontend-context';
import Button from '@/components/button/button';
import Dialog from '@/components/dialog/dialog';
import Icon from '@/components/icon/icon';
import AsyncButton from '@/components/button/async-button';
import Currency from '@/components/currency/currency';
import { useNavigate } from "react-router";
import LoadingScreen from '../loading/loading-screen';


export default function Shop() {
    const [data, isPending, error] = useAsync(backend.getShop);

    const testShop = {
        title: 'Shop',
        description: 'A place to buy cool new things!',
        coinIcon: 'coin.webp',
        products: []
    };

    for(let i=0; i < 5; i++) {
        testShop.products.push({
            id: '',
            price: 50,
            type: 'weapon',
            product: {
                icon: 'gem_staff.webp'
            }
        });
    }
    for(let i=0; i < 5; i++) {
        testShop.products.push({
            id: '',
            price: 50,
            type: 'item',
            product: {
                icon: 'phoenix_down.webp'
            }
        });
    }
    for(let i=0; i < 5; i++) {
        testShop.products.push({
            id: '',
            price: 50,
            type: 'book',
            product: {
                icon: 'phoenix_down.webp'
            }
        });
    }

    const pendingUI = backend.cache.shop ? <ShopRender shop={backend.cache.shop}/> : <LoadingScreen/>;

    return (        
        <div>
            {isPending && pendingUI}
            {data && <ShopRender shop={data}/>}
            {error && <p>Sorry something went wrong. Try refreshing the page.</p>}
        </div>
    );
}

function ShopRender({shop}) {
    const navigate = useNavigate();
    const [filterValue, setFilterValue] = useState('all');
    const [products, setProducts] = useState([]);
    const [player, setPlayer] = useState(frontendContext.get().player);

    const onFilterChanged = (event) => {
        setFilterValue(event.target.value);
    };

    const onGetCoinsClick = async () => {
        const liveProducts = await frontendContext.getProducts();
        setProducts(liveProducts);
        const dialog = document.querySelector('#get-coins');
        dialog.showModal();
    };

    const filteredShopItems = shop.products.filter((product) => {
        return filterValue === 'all' || product.type === filterValue;
    });
    const itemMap = {};

    for(const item of filteredShopItems) {
        if(!itemMap[item.type]) {
            itemMap[item.type] = [];    
        }
        itemMap[item.type].push(item);
    }

    const shopSections = [];
    for(const productType in itemMap) {
        const shopItems = itemMap[productType].map((item, index) => {
            const urlObject = {
                object: item,
                mode: 'shop'
            }
            return <ShopItemButton shopItem={item} pricing={item.price} imageSrc={item.product.icon} key={`${productType}-${index}`}
            onClick={() => { navigate('/panel/object-view', { state: urlObject }); }}/>;
        });

        shopSections.push(
        <div className={shopStyles['shop-section']} key={productType}>
            <div>{`${productType.charAt(0).toUpperCase()}${productType.substring(1)}s`}</div>
            <div className={shopStyles['shop-section-items']}>{shopItems}</div>
        </div>
        );
    }


    return (
        <>
            <Head>
                <title>Shop</title>
                <meta name="description" content="Buy items, weapons, and book." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={pageStyles['page-container-h-center']}>
                <HeaderBarBack title='Shop' onBackClicked={() => { navigate(-1); }}/>
                <div className={shopStyles['shop-controls']}>
                    <Select className={shopStyles['shop-filter']} onChange={onFilterChanged}>
                        <option value='all'>All</option>
                        <option value='weapon'>Weapons</option>
                        <option value='item'>Items</option>
                        <option value='book'>Books</option>
                    </Select>
                    <Currency className={shopStyles['coin-balance']}>{player.coins}</Currency>
                </div>
                {shopSections}
            </div>
            {true && <AsyncButton className={shopStyles['get-coins-btn']} onClick={onGetCoinsClick}>get coins</AsyncButton>}
            <div style={{height: '60px'}}/>
            <GetCoinsDialog id='get-coins' products={products} onPlayerUpdate={setPlayer}/>
        </>
    );
}

function GetCoinsDialog({id, products, onPlayerUpdate}) {

    const purchaseCoin = (sku) => {
        const purchasePromise = new Promise((resolve, reject) => {
            frontendContext.useBits(sku);
            frontendContext.onTransactionComplete(transactionObject => {
                backend.productPurchase(frontendContext.get().player.id, transactionObject.product.sku, transactionObject.transactionReceipt)
                .then((player) => {
                    onPlayerUpdate?.(player);
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
                    reject();
                });
            });

            frontendContext.onTransactionCancelled(() => {
                reject();
            });

        });

        return purchasePromise;
    };
    const coinOptions = products.map(product => {
        return (
            <div key={product.sku} className={shopStyles['coin-option']}>
                <AsyncButton className={shopStyles['add-coin-btn']} onClick={async () => { await purchaseCoin(product.sku);}}>
                    <span>{product.displayName}</span>
                </AsyncButton>
            </div>
        );
    });
    return (
        <Dialog id={id}>
            <div className={shopStyles['dialog-header']}>Get Coins</div>
            <div style={{textAlign: 'center', padding: '10px', fontSize: '1.25em'}}>Add more coins to your bag</div>
            {coinOptions}
        </Dialog>
    );
}