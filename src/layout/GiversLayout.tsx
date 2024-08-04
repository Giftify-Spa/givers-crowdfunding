import {AppShell, useMantineTheme} from '@mantine/core';
import {AppNavbar} from "../components";

const GiversLayout = ({ children }) => {
    const theme = useMantineTheme();

    return (
        <>
            <AppShell
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
                    },
                }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                navbar={<></>}
                header={<AppNavbar/>}
            >
                {children}
            </AppShell>
        </>
    );
}

export default GiversLayout;
