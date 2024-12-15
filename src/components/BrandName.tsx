import { createStyles, Image, rem, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import logoGivers from '../assets/logos/logo givers_blanco.svg'

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
        // marginLeft: 20,

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
                    src={logoGivers}
                    className={classes.image}
                    alt="Givers Logo"
                />
            )}
        </UnstyledButton>
    );
};

export default Brand;
