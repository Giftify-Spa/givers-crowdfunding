import { Container, createStyles, Group, Image, Overlay, rem, Stack, Text, Title } from '@mantine/core';
import { Foundation } from '../../interfaces/Foundation';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        backgroundImage:
            'url(https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/background-landing.png?alt=media&token=f90d63f0-526f-4e13-9a7c-24eabfea4dbe)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: rem(320),
        margin: 0,
        padding: 0,

        [theme.fn.smallerThan('md')]: {
            height: rem(200),
        },

        [theme.fn.smallerThan('sm')]: {
            paddingBottom: rem(50),
        },
    },

    inner: {
        position: 'absolute',
        zIndex: 1,
        height: rem(400),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'self-start',
        justifyContent: 'center',

        [theme.fn.smallerThan('md')]: {
            height: rem(200),
        },
    },

    title: {
        fontWeight: 900,
        fontSize: rem(64),
        letterSpacing: rem(-1),
        color: theme.white,
        textAlign: 'start',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(48),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            textAlign: 'left',
            fontWeight: 700,
            padding: 0,
        },
    },

    text: {
        fontWeight: 400,
        fontSize: rem(20),
        letterSpacing: rem(-1),
        color: theme.white,
        textAlign: 'start',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(16),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(12),
            textAlign: 'left',
            fontWeight: 700,
            padding: 0,
        },
    },

    image: {
        borderRadius: theme.radius.md,
        transition: 'transform 150ms ease',
        position: 'relative',
    },
}));

interface Props {
    data: Foundation;
}

const ProfileSection = ({ data }: Props) => {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Overlay color="#000" opacity={0.65} zIndex={1} />

            <div className={classes.inner}>
                <Container>
                    <Stack spacing="sm" align="stretch" justify="center">
                        {/* Imagen a la izquierda y nombre a la derecha */}
                        <Group align="center" noWrap>
                            <Image src={data.image} height={100} width={100} className={classes.image} />
                            <Title className={classes.title}>{data.name}</Title>
                        </Group>
                        {/* Localidad y Contacto debajo */}
                        <Stack spacing="xs">
                            <Text fw={500} size="md" className={classes.text}>
                                Localidad: {data.country}, {data.city}
                            </Text>
                            <Text fw={500} size="md" className={classes.text}>
                                Contacto: {data.fono}
                            </Text>
                        </Stack>
                    </Stack>
                </Container>
            </div>
        </div>
    );
};

export default ProfileSection;
