import { useEffect, useState } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Loading from "@/components/panel/loading"
import SignUp from "@/components/panel/signup";
import Game from "@/components/panel/game";
import Bag from "@/components/panel/bag";
import Profile from "@/components/panel/profile";
import Shop from "@/components/panel/shop";
import ObjectView from "@/components/panel/object-view";
import Inventory from "@/components/panel/inventory";
import Battle from "@/components/panel/battle";

export default function Panel() {
    const [router, setRouter] = useState();
    useEffect(() => {
        setRouter(createMemoryRouter([
            {
                path: "*",
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
                path: "panel/bag",
                element: <Bag/>
            },
            {
                path: "panel/profile",
                element: <Profile/>
            },
            {
                path: "panel/shop",
                element: <Shop/>
            },
            {
                path: "panel/object-view",
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
        ]));
    }, []);
    
    return (
        <>
            {router && <RouterProvider router={router}/>}
        </>
    );
}