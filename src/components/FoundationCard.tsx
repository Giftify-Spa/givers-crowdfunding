import {
    Button,
    Card,
    createStyles,
    getStylesRef,
    Image,
    PaperProps,
    Stack,
    Text,
} from '@mantine/core';
import { Link } from "react-router-dom";
import { Foundation } from '../interfaces/Foundation';

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        padding: theme.spacing.lg,
        backdropFilter: `blur(16px) saturate(180%)`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : `rgba(255, 255, 255, 0.75)`,
        border: `2px solid rgba(209, 213, 219, 0.3)`,

        [`&:hover .${getStylesRef('image')}`]: {
            transform: 'scale(1.03)',
        },

        '&:hover': {
            boxShadow: theme.shadows.xl,
            border: `2px solid ${theme.colors.primary[7]}`,
            backgroundColor: theme.colors.primary[0],
            transition: 'all 150ms ease',
        }
    },
    category: {
        backgroundColor: '#ff7f4d',
        borderRadius: theme.radius.xs,
        color: '#FFF',
        display: 'inline-block',
        fontWeight: 'bold',
        padding: theme.spacing.xs,
        marginTop: theme.spacing.md
    },
    title: {
        marginTop: theme.spacing.md,
        fontWeight: 'bold'
    },

    image: {
        ref: getStylesRef('image'),
        transition: 'transform 150ms ease',
    }
}));

interface IProps extends PaperProps {
    data: Foundation
    showActions?: boolean
}

const FoundationCard = ({ data }: IProps) => {
    const { classes } = useStyles();

    const {
        id,
        name,
        country,
        city,
        image
    } = data;
    const linkProps = { to: `/foundation/${id}` };

    return (
        <Card radius="sm" shadow="md" ml="xs" className={classes.card}>
            <Card.Section>
                <Image src={image} height={280} className={classes.image} />
            </Card.Section>

            <Card.Section pt={0} px="md" pb="md">
                <Stack>
                    {/* <Text className={classes.category} lineClamp={1} fw={500} size="lg">
                        {status}
                    </Text> */}
                    {/* <Text className={classes.category} lineClamp={1} fw={500} size="lg">
                        {isCause ? 'Causa' : 'Experiencia'}
                    </Text> */}
                    <Text className={classes.title} lineClamp={1} fw={500} size="lg">
                        {name}
                    </Text>

                    <Text fw={500}>{country}, {city}</Text>

                    <Button component={Link} {...linkProps}>Ver campañas</Button>
                </Stack>
            </Card.Section>
        </Card>
    );
};

export default FoundationCard;
