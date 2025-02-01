import { useContext, useState } from 'react';
import { Button, createStyles, Flex, FlexProps, getStylesRef, rem, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBuildingWarehouse, IconChevronDown, IconDoorExit, IconFolderPlus, IconHome, IconHomeCog } from '@tabler/icons-react';
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

    linkDropdown: {
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
            color: theme.white,
        },
    },

    dropdown: {
        marginTop: theme.spacing.xs,
        marginLeft: rem(20), // Slight indent for dropdown items
    },
}));

const dataAdmin = [
    { link: '/admin/dashboard', label: 'Mi Dashboard', icon: IconHome },
    { link: '/admin/campaigns', label: 'Nuestros proyectos', icon: IconBuildingWarehouse },
    { link: '/admin/create-campaign', label: 'Crear Nueva Campaña', icon: IconFolderPlus },
    { link: '/admin/create-foundation', label: 'Crear Nueva Fundación', icon: IconFolderPlus },
];

const dataGuest = [
    { link: '/', label: 'Inicio', icon: IconHome },
    { link: '/campaigns', label: 'Nuestros Proyectos', icon: IconBuildingWarehouse },
    { link: '/login', label: 'Iniciar Sesión' },
    { link: '/register', label: 'Regístrate' },
    { link: '/registerFoundation', label: 'Regístrar Organización' },
];
const ICON_SIZE = 18

type IProps = FlexProps

const AppLinks = ({ ...others }: IProps) => {
    const { user, startLogout } = useContext(AuthContext);
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('Billing');
    const isSmallScreen = useMediaQuery('(max-width: 768px)'); // sm breakpoint
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

    const handleAdminToggle = () => {
        setIsAdminDropdownOpen((prev) => !prev);
    };

    const dataClient = [
        { link: '/dashboard', label: 'Mi Dashboard', icon: IconHome },
        { link: '/panel/campaigns', label: 'Nuestros proyectos', icon: IconBuildingWarehouse },
        ...(user?.foundation ? [{ link: `/panel/my-foundation/${user.foundation}`, label: 'Gestionar Organización', icon: IconBuildingWarehouse }] : [])
    ];

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
            {
                item.icon && <item.icon className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
            }
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
            {
                item.icon && <item.icon className={classes.linkIcon} stroke={1.5} size={ICON_SIZE} />
            }
            <span>{item.label}</span>
        </Button>
    ));

    // Admin
    if (user && user.profile == 'Admin') {
        return (
            <Flex gap={4} {...others}>
                <Button
                    component={Link}
                    to="/admin/dashboard"
                    leftIcon={<IconHome size={ICON_SIZE} />}
                    className={classes.link}
                >
                    Dashboard
                </Button>
                <Button
                    onClick={handleAdminToggle}
                    leftIcon={<IconHomeCog size={ICON_SIZE} />}
                    rightIcon={<IconChevronDown size={ICON_SIZE} />}
                    className={classes.link}
                    variant="subtle"
                >
                    Administración del sistema
                </Button>
                {isAdminDropdownOpen && (
                    <Stack spacing="xs" className={classes.dropdown}>
                        {dataAdmin.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                to={item.link}
                                leftIcon={<item.icon size={ICON_SIZE} />}
                                className={classes.link}
                                variant="subtle"
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>
                )}

                {isSmallScreen && (
                    <Button
                        component={Link}
                        className={cx(classes.link)}
                        onClick={startLogout}
                        to={"#"}
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
