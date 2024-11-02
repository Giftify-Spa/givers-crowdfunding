// ProtectedFoundationRoute.tsx
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import { checkDocumentById } from '../../firebase/service';

interface ProtectedFoundationRouteProps {
    component: React.ComponentType;
}

const ProtectedFoundationRoute: React.FC<ProtectedFoundationRouteProps> = ({ component: Component }) => {
    const { user } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();


    const documentExists = checkDocumentById('foundations', id || '');
    if (!user || user.profile !== 'Client' || user.foundation !== id || !documentExists) {
        const redirectTo = user?.profile === 'Admin' ? '/admin/dashboard' : '/panel/dashboard';
        return <Navigate to={redirectTo} />
    }

    return <Component />;
};

export default ProtectedFoundationRoute;