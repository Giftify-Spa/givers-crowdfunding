import { Box, BoxProps, createStyles, Paper, PaperProps, rem, SimpleGrid, Text, TextProps, Title, TitleProps } from "@mantine/core";
import { IconAugmentedReality, 
         IconClipboardHeart,
         IconHeartHandshake,
         IconComet,
         IconDog,
         IconLeaf,
         IconSos,
         IconSchool } from "@tabler/icons-react";


const iconMap = {
    IconAugmentedReality: IconAugmentedReality,
    IconDog: IconDog,
    IconClipboardHeart: IconClipboardHeart,
    IconLeaf: IconLeaf,
    IconSos: IconSos,
    IconSchool: IconSchool,
    IconHeartHandshake: IconHeartHandshake,
    IconComet: IconComet
}


const mockData = [
    {
        icon: 'IconHeartHandshake',
        name: 'CAUSAS',
    },
    {
        icon: 'IconComet',
        name: 'EXPERIENCIAS',
    }
]

interface ICategoriesProps extends PaperProps {
    icon: string
    name: string
}

const Categories = ({ icon, name }: ICategoriesProps) => {
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
        color: theme.white,
        textAlign: 'center',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(48),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(28),
            textAlign: 'center',
            fontWeight: 800,
            padding: 0,
        },
    },
}));

const CategoriesSection = ({ boxProps }: IProps) => {

    const { classes } = useStyles();
    const items = mockData.map((item) => <Categories {...item} key={item.name} />)

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
                <Title className={classes.title}>Conoce nuestras categorías</Title>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <SimpleGrid
                    cols={2}
                    spacing="sm"
                    breakpoints={[
                        { maxWidth: 'md', cols: 2, spacing: 'md' },
                        { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                    ]}
                >
                    {items}
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default CategoriesSection;
