import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingPage from "@/panel/loading"
import SignUp from "@/panel/signup";
import Game from "@/panel/game";
import Bag from "@/panel/bag";
import Profile from "@/panel/profile";
import Shop from "@/panel/shop";
import ObjectView from "@/panel/object-view";
import Inventory from "@/panel/inventory";
import Battle from "@/panel/battle";

export default function Panel() {
    const [router, setRouter] = useState();
    useEffect(() => {
        setRouter(createBrowserRouter([
            {
                path: "/panel",
                element: <LoadingPage/>,
            },
            {
                path: "panel/signup",
                element: <SignUp/>
            },
            {
                path: "panel/game",
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