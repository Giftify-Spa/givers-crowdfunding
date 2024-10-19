import { AspectRatio, Box, BoxProps, createStyles, rem, Text, TextProps, Title, TitleProps } from "@mantine/core";

interface IProps {
    boxProps: BoxProps
    titleProps?: TitleProps,
    subtitleProps?: TextProps
}

const useStyles = createStyles((theme) => ({
    title: {
        fontWeight: 800,
        fontSize: rem(36),
        letterSpacing: rem(-1),
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.black,
        textAlign: 'center',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(48),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            textAlign: 'left',
            fontWeight: 800,
            padding: 0,
            marginLeft: theme.spacing.md,
        },
    },
    subtitle: {
        textAlign: 'center',
        fontWeight: 500,
        fontSize: rem(24),
        letterSpacing: rem(-1),
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
        color: theme.black,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        marginLeft: theme.spacing.md,
        marginRight: theme.spacing.md,

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(16),
            textAlign: 'left',
            padding: 0,
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
            marginLeft: theme.spacing.sm,
            marginRight: theme.spacing.sm,
        },
    },
}));

const WhatIsGiversSection = ({ boxProps }: IProps) => {
    const { classes } = useStyles();

    return (
        <Box
            {...boxProps}
            style={{ backgroundColor: '#f3f7f6' }}
            sx={{
                ...boxProps.sx,
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                backgroundColor: '#08857f',
            }}
        >
            <Box mb="lg">
                <Title className={classes.title}>
                    ¿Qué es Givers?
                </Title>
            </Box>
            <AspectRatio ratio={16 / 9} mx="auto" sx={{ maxWidth: rem(480) }}> {/* Cambia aquí el tamaño máximo */}
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/fJ9rUzIMcZQ"
                    title="What is Givers?"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </AspectRatio>
            <Text className={classes.subtitle}>
                Haz la diferencia y súmate a la nueva forma de donar.
                <Text component="span" weight={700} style={{ fontStyle: 'italic' }}>
                    Da esperanza, se un Giver.
                </Text>
            </Text>
        </Box>
    );
};

export default WhatIsGiversSection;
