import { Outlet, ScrollRestoration } from "react-router-dom";

export const TransbankRouter = () => {

    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );

}