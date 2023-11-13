import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button'
import Select from '@/components/select/select'

import pageStyles from '@/styles/pages.module.css'
import inventoryStyles from '@/styles/inventory.module.css'
import BagObjectButton from '@/components/object-viewers/bag-object-button'
import InventoryObjectButton from '@/components/object-viewers/inventory-object-button'

export default function Inventory() {
    return (
        <>
            <Head>
                <title>Inventory</title>
                <meta name="description" content="Move objects to and from your inventory and bag." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </Head>
            <div className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Inventory'/>
                <div className={inventoryStyles['bag-full-notification']}>Bag Full</div>
                <div className={inventoryStyles['page-nav']}>
                    <Button className={`${inventoryStyles['left-page-nav']} material-symbols-outlined`}>arrow_back</Button>
                    <div className={inventoryStyles['page-tracker']}>1/10</div>
                    <Button className={`${inventoryStyles['right-page-nav']} material-symbols-outlined`}>arrow_forward</Button>
                </div>
                <div className={inventoryStyles['inventory-view']}>
                    <div>Bag</div>
                    <div className={inventoryStyles['bag-preview']}>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                        <BagObjectButton className={inventoryStyles['bag-item']}/>
                    </div>
                    <div className={inventoryStyles['inventory-container']}>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                        <InventoryObjectButton/>
                    </div>
                </div>
            </div>
        </>
    )
}