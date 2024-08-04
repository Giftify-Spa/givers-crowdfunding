import { useContext, useState } from 'react';
import { Button, createStyles, Flex, FlexProps, getStylesRef, rem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDoorExit, IconFolderPlus, IconHome, IconUser, IconUserPlus, } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/auth/AuthContext';

const useStyles = createStyles((theme) => ({
    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
    },

    footer: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        padding: theme.spacing.sm,
    },

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[0],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.primary[7],
            color: theme.colorScheme === 'dark' ? theme.white : theme.white,

            [`& .${getStylesRef('icon')}`]: {
                color: theme.colorScheme === 'dark' ? theme.black : theme.white,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[0],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.colors.primary[8] }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.colors.primary[8] }).color,

            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    },
}));

const dataAdmin = [
    { link: '/admin/dashboard', label: 'Mi Dashboard', icon: IconHome },
    { link: '/admin/create-campaign', label: 'Crear Nueva Campaña', icon: IconFolderPlus },
    { link: '/admin/create-foundation', label: 'Crear Nueva Fundación', icon: IconFolderPlus },
];

const dataClient = [
    { link: '/dashboard', label: 'Mi Dashboard', icon: IconHome },
];

const dataGuest = [
    { link: '/', label: 'Inicio', icon: IconHome },
    { link: '/login', label: 'Iniciar Sesión', icon: IconUser },
    { link: '/register', label: 'Crear Cuenta', icon: IconUserPlus },
];
const ICON_SIZE = 18

type IProps = FlexProps

const AppLinks = ({ ...others }: IProps) => {
    const { user, startLogout } = useContext(AuthContext);
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('Billing');
    const isSmallScreen = useMediaQuery('(max-width: 768px)'); // sm breakpoint

    const linksAdmin = dataAdmin.map((item) => (
        <Button
            component={Link}
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            to={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
            <span>{item.label}</span>
        </Button>
    ));

    const linksClient = dataClient.map((item) => (
        <Button
            component={Link}
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            to={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
            <span>{item.label}</span>
        </Button>
    ));

    const linksGuest = dataGuest.map((item) => (
        <Button
            component={Link}
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            to={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
            <span>{item.label}</span>
        </Button>
    ));

    // Admin
    if (user && user.profile == 'Admin') {
        return (
            <Flex gap={4} {...others}>
                {linksAdmin}
                {isSmallScreen && (
                    <Button
                        component={Link}
                        className={cx(classes.link)}
                        onClick={startLogout}
                        to={""}
                    >
                        <IconDoorExit className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
                        <span>Cerrar Sesión</span>
                    </Button>
                )}
            </Flex>
        )
    }

    // Client 
    if (user && user.profile == 'Client') {
        return (
            <Flex gap={4} {...others}>
                {linksClient}
                {isSmallScreen && (
                    <Button
                        component={Link}
                        className={cx(classes.link)}
                        onClick={startLogout}
                        to={""}
                    >
                        <IconDoorExit className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
                        <span>Cerrar Sesión</span>
                    </Button>
                )}
            </Flex>
        )
    }

    return (
        <Flex gap={4} {...others}>
            {linksGuest}
        </Flex>
    );
}

export default AppLinks;
