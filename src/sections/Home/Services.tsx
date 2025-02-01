import {
    Box,
    BoxProps,
    Card,
    createStyles,
    PaperProps,
    rem,
    SimpleGrid,
    Stack,
    Text,
    Title,
    TitleProps
} from '@mantine/core';
import { IconHomeShield } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    feature: {
        padding: theme.spacing.lg,
        backdropFilter: `blur(16px) saturate(180%)`,
        backgroundColor: 'transparent',
        border: `1px solid rgba(209, 213, 219, 0.3)`
    },
    wrapper: {
        position: 'relative',
        // paddingTop: rem(180),
        // paddingBottom: rem(130),
        backgroundImage:
            'url(https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/background-landing.png?alt=media&token=f90d63f0-526f-4e13-9a7c-24eabfea4dbe)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: rem(640),
        margin: 0,
        padding: 0,

        [theme.fn.smallerThan('md')]: {
            height: rem(560),
        },

        [theme.fn.smallerThan('sm')]: {
            paddingTop: rem(80),
            paddingBottom: rem(50),
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
        height: rem(640),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        [theme.fn.smallerThan('md')]: {
            height: rem(560),
        }
    },

    title: {
        fontWeight: 900,
        fontSize: rem(64),
        letterSpacing: rem(-1),
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.white,
        textAlign: 'start',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(48),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            textAlign: 'left',
            fontWeight: 700,
            padding: 0
        },
    },

    highlight: {
        color: theme.colors.gray[4],
    },

    controls: {
        marginTop: `calc(${theme.spacing.xl} * 1.5)`,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    control: {
        borderRadius: theme.radius.xl,
        fontSize: theme.fontSizes.md,

        '&:not(:first-of-type)': {
            marginLeft: theme.spacing.md,
        },

        [theme.fn.smallerThan('xs')]: {
            '&:not(:first-of-type)': {
                marginTop: theme.spacing.md,
                marginLeft: 0,
            },
        },
    },

    secondaryControl: {
        color: theme.white,
        backgroundColor: 'rgba(255, 255, 255, .4)',

        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, .45) !important',
        },
    },

    badge: {
        width: "fit-content",
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        backgroundImage: theme.fn.gradient({ from: theme.colors.green[2], to: theme.colors.lime[6], deg: 20 }),
        fontWeight: 500
    },
    titleSection: {
        fontWeight: 800,
        fontSize: rem(36),
        letterSpacing: rem(-1),
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.black,
        textAlign: 'center',
        marginBottom: 55,

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(48),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            textAlign: 'center',
            fontWeight: 800,
            padding: 0,
        },
    },
}));

interface ServiceProps extends PaperProps {
    icon: string
    title: string;
    description: string;
}

const mockdata = [
    {
        id: 1,
        icon: 'https://icons.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        title: 'Transparencia',
        description: 'Recibiras un vídeo con el real impacto de tu donación',
    },
    {
        id: 2,
        icon: 'https://icons.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
        title: 'Impacto',
        description: 'Puedes donar desde $1.000 pesos y crear grandes cambios.',
    },
    {
        id: 3,
        icon: 'https://icons.unsplash.com/photo-1574607383476-f517f260d30b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        title: 'Beneficios',
        description: 'Obten regalías en comercios locales. ¡Te premiamos por donar!',
    }
];

function Service({ title, description }: ServiceProps) {
    const { classes, cx } = useStyles();

    return (
        <Card className={cx(classes.feature, 'card')} shadow="md" radius="sm">
            <Card.Section>
                <Stack style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Stack style={{ backgroundColor: '#ff7f4d', borderRadius: '100px', padding: '20px' }}>
                        <IconHomeShield
                            style={{
                                margin: 'auto',
                            }}
                            size={64}
                            color="white"
                        />
                    </Stack>
                </Stack>
            </Card.Section>
            <Stack spacing="sm" mt="md">
                <Title order={4}>{title}</Title>
                <Text size="sm">{description}</Text>
            </Stack>
        </Card>
    );
}

interface IProps {
    boxProps: BoxProps
    titleProps?: TitleProps
}

const ServicesSection = ({ boxProps }: IProps) => {
    const items = mockdata.map((item) => <Service {...item} key={item.id} />);
    const { classes } = useStyles();

    return (
        <Box {...boxProps}>
            <Title className={classes.titleSection}>
                ¿Por qué <Text
                    component="span"
                    inherit
                    color='#ff7f4d'
                >
                    nosotros?
                </Text>
            </Title>
            <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 2, spacing: 'sm' }]} sx={{ marginBottom: 20 }} >
                {items[0]}
                {items[1]}
                <Box
                    sx={(theme) => ({
                        [theme.fn.smallerThan('md')]: {
                            gridColumn: '1 / span 2',
                        },
                    })}
                >
                    {items[2]}
                </Box>
            </SimpleGrid>
        </Box>
    );
}
export default ServicesSection;
