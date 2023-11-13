import Head from 'next/head'
import { useState } from 'react';

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Select from '@/components/select/select';

import pageStyles from '@/styles/pages.module.css'
import shopStyles from '@/styles/shop.module.css'
import ShopItemButton from '@/components/object-viewers/shop-item-button';


export default function Shop() {
    const [filterValue, setFilterValue] = useState('all');

    const onFilterChanged = (event) => {
        setFilterValue(event.target.value);
    };

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

    const filteredShopItems = testShop.products.filter((product) => {
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
            return <ShopItemButton imageSrc={item.product.icon} key={`${productType}-${index}`}/>;
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
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </Head>
            <div className={pageStyles['page-container-h-center']}>
                <HeaderBarBack title='Shop'/>
                <div className={shopStyles['shop-controls']}>
                    <Select className={shopStyles['shop-filter']} onChange={onFilterChanged}>
                        <option value='all'>All</option>
                        <option value='weapon'>Weapons</option>
                        <option value='item'>Items</option>
                        <option value='book'>Books</option>
                    </Select>
                    <span className={shopStyles['coin-balance']}>Coin 1000</span>
                </div>
                {shopSections}
            </div>
        </>
    );
}