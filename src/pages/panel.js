import { useEffect, useState } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import Loading from "@/components/panel/loading"
import SignUp from "@/components/panel/signup";
import Game from "@/components/panel/game";
import Bag from "@/components/panel/bag";
import Profile from "@/components/panel/profile";
import Shop from "@/components/panel/shop";
import ObjectView from "@/components/panel/object-view";
import Inventory from "@/components/panel/inventory";
import Battle from "@/components/panel/battle";
import RootPath from "@/components/panel/root-path";
import GameGuide from "@/components/panel/game-guide";

export default function Panel() {
    const [router, setRouter] = useState();
    useEffect(() => {
        setRouter(createMemoryRouter([
            {
                path: '/',
                element: <RootPath/>,
                children: [
                    {
                        path: '/panel/loading',
                        element: <Loading/>,
                    },
                    {
                        path: "/panel/signup",
                        element: <SignUp/>
                    },
                    {
                        path: "/panel/game",
                        element: <Game/>
                    },
                    {
                        path: "/panel/bag",
                        element: <Bag/>
                    },
                    {
                        path: "/panel/profile",
                        element: <Profile/>
                    },
                    {
                        path: "/panel/shop",
                        element: <Shop/>
                    },
                    {
                        path: "/panel/object-view",
                        element: <ObjectView/>
                    },
                    {
                        path: "/panel/inventory",
                        element: <Inventory/>
                    },
                    {
                        path: "/panel/battle",
                        element: <Battle/>
                    },
                    {
                        path: "/panel/game-guide",
                        element: <GameGuide/>
                    },
                    
                ]
            }
        ]));
    }, []);
    
    return (
        <>
            {router && <RouterProvider router={router}/>}
        </>
    );
}
