import { createStyles, Image, ImageProps, Overlay, rem, Title } from '@mantine/core';

import corfoImage from '../../assets/logos/corfo.png';
import finaciadoImage from '../../assets/logos/financiado.png';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        backgroundImage:
            'url(https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/fondogivers2.png?alt=media&token=1576a23b-4824-405a-a027-850db3280c0b)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 5%',
        height: rem(755),
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
        height: '100%', // Asegurarse de que ocupe toda la altura del wrapper
        display: 'flex',
        alignItems: 'center', // Centrar verticalmente el contenido
        justifyContent: 'flex-end', // Centrar horizontalmente el contenido
        padding: theme.spacing.md,

        [theme.fn.smallerThan('md')]: {
            height: 'auto',
        },
    },

    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // Centrar horizontalmente los elementos
        justifyContent: 'center', // Centrar verticalmente los elementos
        width: '100%',
        maxWidth: rem(800),
        padding: theme.spacing.md,

        [theme.fn.smallerThan('sm')]: {
            width: '100%',
            padding: `${theme.spacing.sm} 0`,
        },
    },

    title: {
        fontWeight: 900,
        fontSize: rem(48),
        color: theme.white,
        textAlign: 'end',

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            fontWeight: 700,
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

    controls: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
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
            <Overlay color="#000" opacity={0.45} zIndex={1} />

            <div className={classes.inner}>
                <div className={classes.contentContainer} >
                    <Title className={classes.title}>
                        {title}
                    </Title>
                    <Title className={classes.subtitle}>
                        {subtitle}
                    </Title>
                    <div className={classes.controls}>
                        <Image src={corfoImage} {...imageProps} />
                        <Image src={finaciadoImage} {...imageProps} />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default HeroLandingSection;