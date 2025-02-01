import { Outlet, ScrollRestoration } from "react-router-dom";

export const MercadopagoRouter = () => {

    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );

}