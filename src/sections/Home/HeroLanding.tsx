import { createStyles, Image, ImageProps, Overlay, rem, Stack, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        backgroundImage:
            'url(https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/fondogivers1.png?alt=media&token=9f090341-8319-4f73-ba1a-fdc83b383b05)',
        backgroundSize: 'cover',
        // backgroundPosition: 'center',
        backgroundPosition: 'center 5%',
        height: rem(750),
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
        alignItems: 'flex-end', // Cambia la alineación a la derecha
        justifyContent: 'center',
        padding: 0,

        [theme.fn.smallerThan('md')]: {
            height: rem(560),
        }
    },

    title: {
        fontWeight: 900,
        fontSize: rem(64),
        color: theme.white,
        textAlign: 'end',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(48),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            fontWeight: 700,
        },
    },

    subtitle: {
        fontWeight: 600,
        fontSize: rem(32),
        color: theme.colors.gray[2],
        textAlign: 'end',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(24),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(20),
            fontWeight: 500,
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

    stack: {
        alignItems: 'flex-end',  // Alineación del contenido al borde derecho
        justifyContent: 'flex-end',
        width: '60%', // Opción para que ocupe toda la línea y el contenido esté a la derecha
        marginRight: 20,
    },
    control: {
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
    }
}));

const imageProps: ImageProps = {
    height: 80,
    fit: "contain",
    py: "xl"
}

interface Props {
    title: string;
    subtitle?: string;
}

const HeroLandingSection = ({ title, subtitle }: Props) => {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Overlay color="#000" opacity={0.45} zIndex={1} />

            <div className={classes.inner}>

                <Stack spacing="xl" className={classes.stack}>
                    <Title className={classes.title}>
                        {title}
                    </Title>
                    <Title className={classes.subtitle}>
                        {subtitle}
                    </Title>
                </Stack>

                <div className={classes.controls}>
                    <Image src="https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/corfo.png?alt=media&token=80b6baa6-97b0-4d42-90fc-2b5dcde28d27" {...imageProps} />
                    <Image src="https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/financiado.png?alt=media&token=37731610-9f90-4c32-9373-a0fb589793ad" {...imageProps} />
                </div>
            </div>
        </div >
    );
}

export default HeroLandingSection;