import { Container, createStyles, Image, ImageProps, Overlay, rem, Stack, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
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
    subtitle: {
        fontWeight: 600, // Lighter font weight compared to the main title
        fontSize: rem(32), // Reduced size for a subtitle
        letterSpacing: rem(-0.5), // Slight adjustment to letter spacing
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.colors.gray[2], // Less prominent color than white for a subtitle
        textAlign: 'start',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(24), // Smaller size for medium screens
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(20), // Even smaller size for small screens
            textAlign: 'left',
            fontWeight: 500, // Lighter font weight on small screens for better readability
            padding: 0, // Remove padding on small screens
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
            <Overlay color="#000" opacity={0.65} zIndex={1} />

            <div className={classes.inner}>
                <Container>
                    <Stack spacing="xl">
                        <Title className={classes.title}>
                            {title}
                        </Title>
                        <Title className={classes.subtitle}>
                            {subtitle}
                        </Title>
                    </Stack>
                </Container>
                <div className={classes.controls}>
                    <Image src="https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/corfo.png?alt=media&token=80b6baa6-97b0-4d42-90fc-2b5dcde28d27" {...imageProps} />
                    <Image src="https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/financiado.png?alt=media&token=37731610-9f90-4c32-9373-a0fb589793ad" {...imageProps} />
                </div>
            </div>
        </div >
    );
}

export default HeroLandingSection;
