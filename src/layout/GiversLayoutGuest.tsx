import { AppShell } from '@mantine/core';
import AppNavbarGuest from '../components/navbar/AppNavbarGuest';
import { LandingFooter } from '../components';

const GiversLayoutGuest = ({ children }) => {
    const data = {
        title: 'Givers',
        links: [
            { label: 'Contacto', link: '/landing' },
            { label: 'Terminos de uso', link: '/landing' },
            { label: 'Politicas de Privacidad', link: '/landing' },
        ],
    }

    return (
        <>
            <AppShell
                styles={{
                    main: {
                        background: 'transparent',
                        padding: '0px',
                        minHeight: '100vh',
                        overflow: 'auto'
                    },
                }}
                navbar={<AppNavbarGuest />}
                footer={<LandingFooter data={[data]} />}
            >
                {children}
            </AppShell>
        </>
    );
}

export default GiversLayoutGuest;
