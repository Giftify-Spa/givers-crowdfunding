import { createStyles, Image, rem, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    imageContainer: {
        [theme.fn.smallerThan('md')]: {
            textAlign: 'center'
        },

        [theme.fn.smallerThan('xs')]: {
            textAlign: 'center'
        },
    },
    image: {
        width: `${rem(120)} !important`, // Ajusta el tamaño del logo para la navbar
        height: 'auto',

        [theme.fn.smallerThan('md')]: {
            width: `${rem(100)} !important`, // Tamaño más pequeño en pantallas medianas
        },

        [theme.fn.smallerThan('sm')]: {
            width: `${rem(80)} !important`, // Tamaño más pequeño en pantallas pequeñas
        },
    },
}))

const Brand = () => {
    const { classes } = useStyles();
    const isSmallOrMedium = useMediaQuery('(max-width: 992px)');

    return (
        <UnstyledButton component={Link} to="/" className={classes.imageContainer}>
            {!isSmallOrMedium && (
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/givers-48277.appspot.com/o/logo%20givers_blanco.svg?alt=media&token=c314e77a-5dd2-4da4-874c-b17808dc5563"
                    className={classes.image}
                    alt="Givers Logo"
                />
            )}
        </UnstyledButton>
    );
};

export default Brand;
