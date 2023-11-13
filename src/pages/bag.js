import Head from 'next/head'

import HeaderBarBack from '@/components/header-bar/header-bar-back'
import Button from '@/components/button/button';
import BagObjectButton from '@/components/object-viewers/bag-object-button';

import pageStyles from '@/styles/pages.module.css'
import bagStyles from '@/styles/bag.module.css'

export default function Bag() {
    return (
        <>
            <Head>
                <title>Bag</title>
                <meta name="description" content="A place where players can manage their bag." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </Head>
            <div style={{gap: '15px'}} className={`${pageStyles['page-container-h-center']}`}>
                <HeaderBarBack title='Bag'/>
                <div className={`${bagStyles['bag-viewer']}`}>
                    <BagObjectButton/>
                    <BagObjectButton/>
                    <BagObjectButton/>
                    <BagObjectButton/>
                    <BagObjectButton imageSrc='tome_azure.webp'/>
                </div>
            </div>
            <Button className={`${bagStyles['inventory-btn']} material-symbols-outlined`}>inventory_2</Button>
        </>
    );
}