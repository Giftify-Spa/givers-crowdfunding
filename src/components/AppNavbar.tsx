/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Box,
    BoxProps,
    Burger,
    Container,
    createStyles,
    Drawer,
    Group,
    Header,
    Image,
    Menu,
    rem,
    ScrollArea,
    Text,
    UnstyledButton,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
    IconChevronDown,
    IconLogout,
    IconSettings
} from '@tabler/icons-react';
import { useContext, useState } from "react";
import { AppLinks, BrandName, SearchDrawer } from "./index";
import { AuthContext } from '../context/auth/AuthContext';
import { Link } from 'react-router-dom';
import logoGivers from '../assets/logos/logo givers_blanco.svg';

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
        },

        [theme.fn.smallerThan('sm')]: {
            // display: 'none',
            padding: 4
        },
    },

    userActive: {
        // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
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
    },
    image: {
        width: `${rem(120)} !important`, // Ajusta el tamaño del logo para la navbar
        height: 'auto',
        marginLeft: 10,

        [theme.fn.smallerThan('md')]: {
            width: `${rem(100)} !important`, // Tamaño más pequeño en pantallas medianas
        },

        [theme.fn.smallerThan('sm')]: {
            width: `${rem(80)} !important`, // Tamaño más pequeño en pantallas pequeñas
        },
    },
}));

type IProps = BoxProps

const AppNavbar = ({ ...others }: IProps) => {

    const { user, startLogout } = useContext(AuthContext);
    const { classes, theme, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
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
                            <BrandName />
                            <AppLinks className={classes.hiddenMobile} />
                        </Group>
                        <Group>
                            <Menu
                                width={260}
                                position="bottom-end"
                                transitionProps={{ transition: 'pop-top-right' }}
                                onClose={() => setUserMenuOpened(false)}
                                onOpen={() => setUserMenuOpened(true)}
                                withinPortal
                            >
                                <Menu.Target>
                                    <UnstyledButton
                                        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                    >
                                        <Group spacing={7}>
                                            {/* <Avatar
                                                src={user.image}
                                                alt={user?.name}
                                                radius="xl"
                                                size={matchesMobile ? 18 : 20}
                                            /> */}
                                            {!matchesMobile &&
                                                <>
                                                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                                        {user?.name}
                                                    </Text>
                                                    <IconChevronDown size={rem(12)} stroke={1.5} />
                                                </>}
                                        </Group>
                                    </UnstyledButton>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Ajustes</Menu.Label>
                                    <Menu.Item 
                                        icon={<IconSettings  size="0.9rem" stroke={1.5} />}
                                        component={Link}
                                        to="/admin/profile-settings"
                                        styles={{
                                            item: {
                                              '&:hover': {
                                                backgroundColor: 'transparent', // Elimina el color de fondo en hover
                                                color: 'inherit',               // Mantiene el color de texto original
                                              },
                                            },
                                          }}
                                    >
                                        Ajustes de Cuenta
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={<IconLogout size="0.9rem" stroke={1.5} />}
                                        onClick={startLogout}
                                    >
                                        Cerrar Sesión
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
                title=""
                className={classes.hiddenDesktop}
                classNames={{ header: classes.drawerHeader, close: classes.close }}
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(0)})`} mx="-md" sx={{ backgroundColor: theme.colors.primary[6] }}>
                    <Image
                        src={logoGivers}
                        className={classes.image}
                        alt="Givers Logo"
                    />
                    <AppLinks direction='column' />
                </ScrollArea>
            </Drawer>

            <SearchDrawer opened={searchOpened} onClose={closeSearchDrawer} />
        </Box>
    );
}

export default AppNavbar;
