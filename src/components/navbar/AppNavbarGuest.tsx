import {
    Box,
    BoxProps,
    Burger,
    Container,
    createStyles,
    Drawer,
    Group,
    Header,
    Menu,
    rem,
    ScrollArea,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
    IconSettings,
} from '@tabler/icons-react';
import { AppLinks, BrandName, SearchDrawer } from '..';
import AppLinksGuest from '../AppLinksGuest';

const useStyles = createStyles((theme) => ({
    header: {
        backgroundColor: theme.colors.primary[6]
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[0],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.primary[7],
            color: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        [theme.fn.smallerThan('sm')]: {
            // display: 'none',
            padding: 4
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    link: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,

        [theme.fn.smallerThan('sm')]: {
            height: rem(42),
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.primary[0],
        }),
    },

    subLink: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.primary[0],
        }),

        '&:active': theme.activeStyles,
    },

    dropdownFooter: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        margin: `calc(${theme.spacing.md} * -1)`,
        marginTop: theme.spacing.sm,
        padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
        paddingBottom: theme.spacing.xl,
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
            }`,
    },

    title: {
        textAlign: 'center',
        fontWeight: 800,
        fontSize: rem(40),
        letterSpacing: -1,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        marginBottom: theme.spacing.xs,

        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
            textAlign: 'left',
        },
    },

    highlight: {
        color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
    },

    hiddenMobile: {
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('md')]: {
            display: 'none',
        },
    },

    drawerHeader: {
        backgroundColor: theme.colors.primary[6],
        color: theme.white
    },

    close: {
        color: theme.white
    }
}));

// const user = {
//     "name": "Jane Spoonfighter",
//     "email": "janspoon@fighter.dev",
//     "image": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
// }

// const ICON_SIZE = 18

type IProps = BoxProps

const AppNavbarGuest = ({ ...others }: IProps) => {

    // const { user, startLogout } = useContext(AuthContext);
    const { classes, theme } = useStyles();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [searchOpened, { close: closeSearchDrawer }] = useDisclosure(false);
    const matchesMobile = useMediaQuery('(max-width: 600px)');

    return (
        <Box {...others}>
            <Header
                height={{ base: 50, md: 70 }}
                className={classes.header}
            >
                <Container
                    fluid
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        className={classes.hiddenDesktop}
                        color="white"
                    />

                    <Group position="apart" sx={{ width: '100%' }}>
                        <Group>
                            <BrandName
                                size={24}
                                ml={matchesMobile ? 'md' : 'xs'}
                                asLink
                                variant="grayscale"
                            />
                            {/* Aqui deben ir los links de la landing page */}
                            {/* <AppLinks className={classes.hiddenMobile} /> */}
                        </Group>
                        <Group>
                            <AppLinksGuest className={classes.hiddenMobile} />
                            <Menu
                                width={260}
                                position="bottom-end"
                                transitionProps={{ transition: 'pop-top-right' }}
                                // onClose={() => setUserMenuOpened(false)}
                                // onOpen={() => setUserMenuOpened(true)}
                                withinPortal
                            >
                                <Menu.Dropdown>
                                    <Menu.Label>Ajustes</Menu.Label>
                                    <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
                                        Ajustes de Cuenta
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </Container>
            </Header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Panel de Navagación"
                className={classes.hiddenDesktop}
                classNames={{ header: classes.drawerHeader, close: classes.close }}
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(0)})`} mx="-md" sx={{ backgroundColor: theme.colors.primary[6] }}>
                    <AppLinks direction='column' />
                </ScrollArea>
            </Drawer>

            <SearchDrawer opened={searchOpened} onClose={closeSearchDrawer} />
        </Box>
    );
}

export default AppNavbarGuest;
