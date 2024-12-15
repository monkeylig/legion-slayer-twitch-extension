import { useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router";

function getKey(location, matches) {
    return location.pathname;
}

export default function RootPath() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/panel/loading');
    }, [navigate]);
    return (
        <>
            <Outlet/>
            <ScrollRestoration getKey={getKey}/>
        </>
    );
}