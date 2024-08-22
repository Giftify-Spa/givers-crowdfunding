import { Box, BoxProps, createStyles, rem, TextProps, Title, TitleProps } from "@mantine/core";

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
        color: theme.white,
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
}));

const SubtitleSection = ({ boxProps }: IProps) => {
    const { classes } = useStyles();
    return (
        <Box
            {...boxProps}
            style={{ backgroundColor: '#08857f' }}
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
                <Title className={classes.title}>¿Listo para recaudar fondos para tu idea?</Title>
            </Box>
            
        </Box>
    );
};

export default SubtitleSection;
