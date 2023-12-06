import Head from 'next/head'
import { useRef, useState } from 'react'

import pageStyles from '@/styles/pages.module.css'
import signUpStyles from '@/styles/signup.module.css'
import HeaderBar from '@/components/header-bar/header-bar'
import Button from '@/components/button/button'
import ObjectButton from '@/components/object-viewers/object-button'
import RadioGroup from '@/components/radio-group/radio-group'
import TextBox from '@/components/text-box/text-box'
import useAsync from '@/utilities/useAsync'
import backend from '@/utilities/backend-calls'
import Image from 'next/image'
import frontendContext from '@/utilities/frontend-context'
import { useRouter } from 'next/router'

export default function SignUp() {
    const [data, isPending, error] = useAsync(backend.getGameInfo);

    return (        
        <div>
            {isPending && <h1>Loading Signup Page</h1>}
            {data && <SignUpRender gameInfo={data}/>}
            {error && <p>Sorry something went wrong. Try refreshing the page.</p>}
        </div>
    );
}

function SignUpRender({gameInfo}) {
    const [menuIndex, setMenuIndex] = useState(0);
    const weaponChoice = useRef(null);
    const vitalityChoice = useRef(null);
    const avatarChoice = useRef(null);
    const nameChoice = useRef('');
    const router = useRouter();

    const menuControl = {
        next() {
            setMenuIndex((prev) => {
                return prev + 1
            });
        },
        back() {
            setMenuIndex((prev) => {
                return prev - 1
            });
        }
    };

    const onBeginAdventure = () => {
        backend.createNewPlayer(nameChoice.current, frontendContext.get().accountId, avatarChoice.current, vitalityChoice.current, weaponChoice.current)
        .then(newPlayer => {
            frontendContext.setPlayer(newPlayer);
            router.push('/game');
        })
        .catch(error => {
            console.log(error);
        });
    };

    const menuSequence = [
        {
            title: 'Welcome',
            UI: <WelcomeMenu menuControl={menuControl}/>
        },
        {
            title: 'Strength or Magic?',
            UI: <WeaponMenu menuControl={menuControl} currentValue={weaponChoice.current} startingWeapons={gameInfo.startingWeapons} onValueUpdated={(value) => weaponChoice.current = value}/>
        },
        {
            title: 'Health or Defense?',
            UI: <VitalityMenu menuControl={menuControl} currentValue={vitalityChoice.current} onValueUpdated={(value) => vitalityChoice.current = value}/>
        },
        {
            title: "Avatar",
            UI: <AvatarMenu menuControl={menuControl} currentValue={avatarChoice.current} startingAvatars={gameInfo.startingAvatars} onValueUpdated={(value) => avatarChoice.current = value}/>
        },
        {
            title: 'Choose a Name',
            UI: <NameMenu menuControl={menuControl} currentValue={nameChoice.current} onValueUpdated={(value) => nameChoice.current = value}/>
        },
        {
            title: 'Embark',
            UI: <SendOffScreen menuControl={menuControl} onBeginAdventure={onBeginAdventure}/>
        }
    ];

    const UI = menuSequence[menuIndex].UI;

    return (
        <>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="New player sign up page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${pageStyles['page-container-h-center']} ${signUpStyles['signup-container']}`}>
                <HeaderBar title={menuSequence[menuIndex].title}/>
                {UI}
            </div>
        </>
    )
}

function WelcomeMenu({menuControl}) {
    return (
        <>
            <div className={pageStyles['page-container-v-center']}>
                <p className={signUpStyles['center-text']}>
                    Hello traveler! You are only a few moments away from starting your 
                    journey as a Legion Slayer! Fight monsters and go on incredible adventures!
                </p>
            </div>
            <Button onClick={() => menuControl.next()}>Begin</Button>
        </>
    );
}

function WeaponMenu({menuControl, startingWeapons, onValueUpdated, currentValue}) {
    const [isValid, setIsValid] = useState(currentValue);

    const onChange = (event) => {
        if(onValueUpdated) {
            const value = event.target.value;
            onValueUpdated(value);
            setIsValid(value);
        }
    };
    const optionData = [
        {
            UI: <ObjectButton tilt label={startingWeapons.physical.name} imageSrc={startingWeapons.physical.icon} className={signUpStyles['weapon-choice-btn']}/>,
            value: 'physical',
            checked: currentValue === 'physical'
        },
        {
            UI: <ObjectButton tilt label={startingWeapons.magical.name} imageSrc={startingWeapons.magical.icon} className={signUpStyles['weapon-choice-btn']}/>,
            value: 'magical',
            checked: currentValue === 'magical'
        }
    ];

    return (
        <>
            <p className={signUpStyles['center-text']}>
                How will you defend yourself?
            </p>
            <RadioGroup className={signUpStyles['flex-gap-h']} inputClassName={signUpStyles['weapon-choices-input']}
                labelClassName={signUpStyles['weapon-choices-label']} groupId='weapon-choice' options={optionData} onChange={onChange}/>
            <SignUpNav enableBack enableContinue={isValid} menuControl={menuControl}/>
        </>
    );
}

function VitalityMenu({menuControl, currentValue, onValueUpdated}) {
    const [isValid, setIsValid] = useState(currentValue);

    const onChange = (event) => {
        if(onValueUpdated) {
            const value = event.target.value;
            onValueUpdated(value);
            setIsValid(value);
        }
    };
    const vitilityOptions = [
        {
            UI: <Button className={signUpStyles['vitality-choice-btn']}>With My Defense</Button>,
            value: 'defense',
            checked: currentValue === 'defense'
        },
        {
            UI: <Button className={signUpStyles['vitality-choice-btn']}>With My Health</Button>,
            value: 'health',
            checked: currentValue === 'health'
        }
    ];

    return (
        <>
            <p className={signUpStyles['center-text']}>
                How will you endure damage?
            </p>
            <RadioGroup className={signUpStyles['flex-gap-h']} inputClassName={signUpStyles['vitality-choices-input']}
                labelClassName={signUpStyles['vitality-choices-label']} groupId='vitality-choice' options={vitilityOptions} onChange={onChange}/>
                <SignUpNav enableBack enableContinue={isValid} menuControl={menuControl}/>
        </>
    );
}

function AvatarMenu({menuControl, startingAvatars=[], currentValue, onValueUpdated}) {
    const [isValid, setIsValid] = useState(currentValue);
    const onChange = (event) => {
        const value = event.target.value;
        if(onValueUpdated) {
            onValueUpdated(value);
        }
        setIsValid(value);
    };
    const avatarOptions = startingAvatars.map((avatar) => {
        return {
                UI: <div className={signUpStyles['avatar-btn']}><Image fill src={avatar} className={signUpStyles['avatar-choice-btn']}/></div>,
                value: avatar,
                checked: currentValue === avatar
            };
    });

    return (
    <>
        <p className={signUpStyles['center-text']}>Choose your avatar</p>
        <RadioGroup  className={signUpStyles['flex-gap-h']} inputClassName={signUpStyles['avatar-choices-input']}
                labelClassName={signUpStyles['avatar-choices-label']} groupId='avatar-choice' options={avatarOptions} onChange={onChange}/>
        <SignUpNav enableBack enableContinue={isValid} menuControl={menuControl}/>
    </>
    );
}

function NameMenu({menuControl, onValueUpdated, currentValue}) {
    const [value, setValue] = useState(currentValue);

    const onChange = (event) => {
        if(onValueUpdated) {
            const newValue = event.target.value;
            onValueUpdated(newValue);
            setValue(newValue);
        }
    };
    return (
        <>
            <p className={signUpStyles['center-text']}>
                What is your name Legion Slayer?
            </p>
            <TextBox limit={20} label='Traveler Name' onInput={onChange} value={value}/>
            <SignUpNav enableBack enableContinue={value} menuControl={menuControl}/>
        </>
    );
}

function SendOffScreen({menuControl, onBeginAdventure}) {
    return (
        <>
            <p className={signUpStyles['center-text']}>
                You are now ready to begin your new adventure! Go on and slay monsters, level up, and descover new powerful weapons and abilities!
            </p>
            <SignUpNav enableBack enableCustomButton customButtonText='Begin Adventure' menuControl={menuControl} onCustomButtonClick={onBeginAdventure}/>
        </>
    );
}

function SignUpNav({enableBack=false, enableContinue=false, enableCustomButton=false, customButtonText, menuControl, onCustomButtonClick=()=>{}}) {
    return (
        <div className={signUpStyles['flex-gap-h']}>
            {enableBack && <Button className={signUpStyles['back-btn']} onClick={() => menuControl.back()}>Back</Button>}
            {enableContinue && <Button onClick={() => menuControl.next()}>Continue</Button>}
            {enableCustomButton && <Button className={signUpStyles['custom-btn']} onClick={() => onCustomButtonClick()}>{customButtonText}</Button>}
        </div>
    );
}