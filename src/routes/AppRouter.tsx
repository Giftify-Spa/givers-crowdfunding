import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AuthRouter } from "./auth/AuthRouter";
import { authRoutes } from "./auth/authRoutes";

import { GiversRouter } from "./givers/GiversRouter";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { clientRoutes } from "./client/clientRoutes";
import { adminRoutes } from "./admin/adminRoutes";
import { TransbankRouter } from "./transbank/TransbankRouter";
import { transbankRoutes } from "./transbank/transbankRoutes";

const router = createBrowserRouter([
    // Public Routes
    {
        path: "/*",
        element: <AuthRouter />,
        children: authRoutes,
        errorElement: <><h2>ERROR</h2></>
    },
    // Private Routes for Users
    {
        path: "/panel/*",
        element: (
            <RoleProtectedRoute
                component={GiversRouter}
                allowedRoles={['Client']}
            />
        ),
        children: clientRoutes,
        errorElement: <><h2>ERROR</h2></>
    },

    // Private Routes for Admins
    {
        path: "/admin/*",
        element: (
            <RoleProtectedRoute
                component={GiversRouter}
                allowedRoles={['Admin']}
            />
        ),
        children: adminRoutes,
        errorElement: <><h2>ERROR</h2></>
    },


    // Transbank Routes
    {
        path: "/transbank/*",
        element: <TransbankRouter />,
        children: transbankRoutes,
        errorElement: <><h2>ERROR</h2></>

    }
]);


export const AppRouter = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}