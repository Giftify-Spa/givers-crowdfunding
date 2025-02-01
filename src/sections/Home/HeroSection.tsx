import { Container, createStyles, Overlay, rem, Stack, Text, Title } from '@mantine/core';
import backgrounSection from '../../assets/img/background-landing.png';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        backgroundImage: `url(${backgrounSection})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: rem(320),
        width: '100%',
        margin: 0,
        padding: 0,

        [theme.fn.smallerThan('md')]: {
            height: rem(200),
            marginTop: 60,
            padding: 0
        },

        [theme.fn.smallerThan('sm')]: {
            height: rem(220),
            marginTop: 60,
            padding: 0
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
        height: rem(400),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        [theme.fn.smallerThan('md')]: {
            height: rem(200),
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
            fontSize: rem(36),
            textAlign: 'left',
            fontWeight: 700,
            marginTop: theme.spacing.md,
            
        },
    },

    subtitle: {
        fontWeight: 400,
        fontSize: rem(24),
        color: theme.colors.gray[3],
        textAlign: 'start',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        marginTop: theme.spacing.sm,

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(20),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(18),
        },
    },

    highlight: {
        color: theme.colors.gray[4],
    },

    controls: {
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
interface Props {
    title: string;
    subtitle?: string;
}

const HeroSection = ({ title, subtitle }: Props) => {
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
                        {
                            subtitle && (
                                <Text className={classes.subtitle}>
                                    {subtitle}
                                </Text>
                            )
                        }
                    </Stack>
                </Container>
            </div>
        </div >
    );
}

export default HeroSection;
