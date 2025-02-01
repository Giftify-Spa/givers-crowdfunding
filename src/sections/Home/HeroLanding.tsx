import { createStyles, Image, ImageProps, rem, Title } from '@mantine/core';

import corfoImage from '../../assets/logos/corfo.png';
import finaciadoImage from '../../assets/logos/financiado.png';
import fondoGivers from '../../assets/img/fondogivers2.png';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        backgroundImage: `url(${fondoGivers})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 5%',
        height: rem(755),
        width: '100%',
        margin: 0,
        padding: 0,

        '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 1,
        },

        [theme.fn.smallerThan('sm')]: {
            backgroundPosition: 'left center',
            paddingRight: theme.spacing.md,
        },
        [theme.fn.smallerThan('md')]: {
            paddingTop: rem(80),
            minHeight: rem(560),
        }

    },

    inner: {
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing.md,

        [theme.fn.smallerThan('md')]: {
            height: 'auto',
        },
    },

    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '100%',
        maxWidth: rem(800),
        padding: theme.spacing.md,

        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },

    title: {
        fontWeight: 900,
        fontSize: rem(48),
        color: theme.white,
        textAlign: 'end',

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(32),
            fontWeight: 800,
            textAlign: 'center',
            padding: 0,
            marginBottom: theme.spacing.md,
        },
    },

    subtitle: {
        fontWeight: 600,
        fontSize: rem(24),
        color: theme.colors.gray[2],
        textAlign: 'end',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(20),
            fontWeight: 500,
            textAlign: 'justify',
        },
    },

    footerDesktop: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,

        [theme.fn.smallerThan('md')]: {
            opacity: 0,
        },

        [theme.fn.smallerThan('sm')]: {
            opacity: 0,
        },
    },

    footerLogos: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.lg,
        opacity: 0,

        [theme.fn.smallerThan('md')]: {
            opacity: 1,
        },

        [theme.fn.smallerThan('sm')]: {
            position: 'absolute',
            bottom: theme.spacing.lg,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 1,
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
    height: rem(80),
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
            <div className={classes.inner}>
                <div className={classes.contentContainer} >
                    <Title className={classes.title}>
                        {title}
                    </Title>
                    <Title className={classes.subtitle}>
                        {subtitle}
                    </Title>
                    <div className={classes.footerDesktop}>
                        <Image src={corfoImage} {...imageProps} alt='corfo-desktop'/>
                        <Image src={finaciadoImage} {...imageProps} alt='financed-desktop'/>
                    </div>
                </div>
            </div>
            <div className={classes.footerLogos}>
                <Image src={corfoImage} {...imageProps} alt='corfo'/>
                <Image src={finaciadoImage} {...imageProps} alt='financed'/>
            </div>
        </div >
    );
}

export default HeroLandingSection;