import {
    Button,
    Card,
    createStyles,
    Flex,
    getStylesRef,
    PaperProps,
    Progress,
    Stack,
    Text,
} from '@mantine/core';
import { Link } from "react-router-dom";
import { Campaign } from '../interfaces/Campaign';
import { formattingToCLPNumber } from '../helpers/formatCurrency';
import { calculatePercentage, calculatePercentageString } from '../helpers/percentageCampaign';
import { useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { AuthContext } from '../context/auth/AuthContext';

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
    },

    image: {
        ref: getStylesRef('image'),
        transition: 'transform 150ms ease',
    }
}));

interface IProps extends PaperProps {
    data: Campaign
    showActions?: boolean
}

const CampaignCard = ({ data, showActions }: IProps) => {
    const { classes } = useStyles();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);


    const {
        id,
        name,
        description,
        cumulativeAmount,
        requestAmount,
        initVideo,
        endVideo,
        donorsCount,
        isCause,
        isFinished
    } = data;
    const linkProps = (isAuthenticated && user.profile === "Admin")
        ? { to: `/admin/campaign/${id}`, rel: 'noopener noreferrer' }
        : (isAuthenticated && user.profile === "Client")
            ? { to: `/panel/campaign/${id}`, rel: 'noopener noreferrer' }
            : { to: `/campaign/${id}`, rel: 'noopener noreferrer' };

    return (
        <Card radius="sm" shadow="md" ml="xs" component={Link} {...linkProps} className={classes.card}>
            <Card.Section>
                {/* <Image src={multimedia[0]} height={280} className={classes.image} /> */}
                <iframe
                    width="100%"
                    height="100%"
                    src={isFinished ? endVideo : initVideo}
                    title={`Video campaign ${name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share; picture-in-picture"
                    allowFullScreen
                />
            </Card.Section>

            <Card.Section pt={0} px="md" pb="md">
                <Stack>
                    <Text className={classes.category} lineClamp={1} fw={500} size="lg">
                        {isCause ? 'Causa' : 'Experiencia'}
                    </Text>
                    <Text className={classes.title} lineClamp={1} fw={500} size="lg">
                        {name}
                    </Text>
                    {showActions && <Text lineClamp={3} size="sm">{description}</Text>}

                    {/* <Progress value={daysLeft} /> */}
                    <Progress value={calculatePercentageString(requestAmount.toString(), cumulativeAmount.toString())} size="md" />
                    <Flex justify="space-between">
                        <Text fw={500}>{calculatePercentage(requestAmount, cumulativeAmount)}% Reunido</Text>
                        <Text fw={500}>Meta {formattingToCLPNumber(requestAmount)}</Text>
                    </Flex>

                    <Flex justify="space-between">
                        <Text><b>{formattingToCLPNumber(cumulativeAmount)}</b> recaudados</Text>
                        <Text><b>{donorsCount}</b> donaciones</Text>
                    </Flex>

                    {showActions && <Button>Donar Ahora</Button>}
                </Stack>
            </Card.Section>
        </Card>
    );
};

export default CampaignCard;
