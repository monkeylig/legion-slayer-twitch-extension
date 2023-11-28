import Head from 'next/head'
import { useState } from 'react';

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Select from '@/components/select/select';

import pageStyles from '@/styles/pages.module.css'
import shopStyles from '@/styles/shop.module.css'
import ShopItemButton from '@/components/object-viewers/shop-item-button';
import { useRouter } from 'next/router';
import useAsync from '@/utilities/useAsync';
import backend from '@/utilities/backend-calls';
import frontendContext from '@/utilities/frontend-context';


export default function Shop() {
    const [data, isPending, error] = useAsync(backend.getShop);

    const testShop = {
        title: 'Shop',
        description: 'A place to buy cool new things!',
        coinIcon: 'coin.png',
        products: []
    };

    for(let i=0; i < 5; i++) {
        testShop.products.push({
            id: '',
            price: 50,
            type: 'weapon',
            product: {
                icon: 'gem_staff.png'
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
                icon: 'tome_azure.webp'
            }
        });
    }

    return (        
        <div>
            {isPending && <ShopRender shop={testShop}/>}
            {data && <ShopRender shop={data}/>}
            {error && <p>Sorry something went wrong. Try refreshing the page.</p>}
        </div>
    );
}

function ShopRender({shop}) {
    const router = useRouter();
    const [filterValue, setFilterValue] = useState('all');
    const player = frontendContext.get().player;

    const onFilterChanged = (event) => {
        setFilterValue(event.target.value);
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
                pathname: '/object-view',
                query: {
                    object: JSON.stringify(item),
                    mode: 'shop'
                }
            };
            return <ShopItemButton label={item.product.name} tilt={item.type === 'weapon'}
            pricing={item.price} imageSrc={item.product.icon} key={`${productType}-${index}`}
            onClick={() => {router.push(urlObject)}}/>;
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
                <HeaderBarBack title='Shop' onBackClicked={() => { router.back(); }}/>
                <div className={shopStyles['shop-controls']}>
                    <Select className={shopStyles['shop-filter']} onChange={onFilterChanged}>
                        <option value='all'>All</option>
                        <option value='weapon'>Weapons</option>
                        <option value='item'>Items</option>
                        <option value='book'>Books</option>
                    </Select>
                    <span className={shopStyles['coin-balance']}>Coin - {player.coins}</span>
                </div>
                {shopSections}
            </div>
        </>
    );
}