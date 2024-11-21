import { AppShell, useMantineTheme } from '@mantine/core';
import AppNavbarGuest from '../components/navbar/AppNavbarGuest';
import { LandingFooter } from '../components';

const GiversLayoutGuest = ({ children }) => {
    const theme = useMantineTheme();

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
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
                        padding: '0px',
                        minHeight: '100vh',
                        margin: '0px',
                        overflow: 'visible'
                    },
                }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                navbar={<AppNavbarGuest />}
                footer={<LandingFooter data={[data]} />}
            >
                {children}
            </AppShell>
        </>
    );
}

export default GiversLayoutGuest;
