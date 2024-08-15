import { Box, BoxProps, createStyles, Paper, PaperProps, rem, SimpleGrid, Text, TextProps, Title, TitleProps } from "@mantine/core";
import {
    IconAugmentedReality,
    IconClipboardHeart,
    IconDog,
    IconLeaf,
    IconSos,
    IconSchool
} from "@tabler/icons-react";


const iconMap = {
    IconAugmentedReality: IconAugmentedReality,
    IconDog: IconDog,
    IconClipboardHeart: IconClipboardHeart,
    IconLeaf: IconLeaf,
    IconSos: IconSos,
    IconSchool: IconSchool,
}


const mockData = [
    {
        icon: 'IconAugmentedReality',
        name: 'Tecnología',
    },
    {
        icon: 'IconDog',
        name: 'Animales',
    },
    {
        icon: 'IconSchool',
        name: 'Escolar',
    }
]

interface IDonationsProps extends PaperProps {
    icon: string
    name: string
}

const Donations = ({ icon, name }: IDonationsProps) => {
    const IconComponent = iconMap[icon];

    return (
        <Paper
            m="sm"
            p="md"
            shadow="md"
            radius="sm"
            sx={{
                width: rem(150), // Ancho fijo para cada contenedor
                aspectRatio: '1 / 1', // Relación de aspecto 1:1 para hacerlos cuadrados
                backdropFilter: `blur(16px) saturate(180%)`,
                backgroundColor: 'transparent',
                border: `2px solid #FFF`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <IconComponent
                size={64}
                color="#ff7f4d"
                style={{
                    marginBottom: '10px',
                }}
                stroke={1}
            />
            <Text
                size="md"
                style={{
                    textAlign: 'center',
                    fontWeight: 500,
                    color: '#FFF'
                }}
            >
                {name}
            </Text>
        </Paper>
    )
}

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
        fontSize: rem(20),
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

const DonationsSection = ({ boxProps }: IProps) => {

    const { classes } = useStyles();
    const items = mockData.map((item) => <Donations {...item} key={item.name} />)

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
                <Title className={classes.title}>Recaudar fondos en Givers es fácil, eficaz y confiable</Title>
                <Text className={classes.subtitle}>
                    Cubilia iaculis aliquet a mus sodales nulla vitae senectus mollis litora quisque eros at, tempor egestas taciti facilisis risus platea luctus scelerisque natoque dui nascetur. Fringilla mattis cras lacinia conubia viverra aliquet aliquam ridiculus venenatis ultricies, sem mollis eros neque pellentesque potenti magnis vitae
                </Text>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <SimpleGrid
                    cols={3}
                    spacing="sm"
                    breakpoints={[
                        { maxWidth: 'md', cols: 3, spacing: 'md' },
                        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                    ]}
                >
                    {items}
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default DonationsSection;
