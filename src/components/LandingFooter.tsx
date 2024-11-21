import { ActionIcon, Box, Container, createStyles, Grid, Group, Image, rem, Text, Title } from '@mantine/core';
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTwitter
} from '@tabler/icons-react';
import { BrandName } from "./index";

const useStyles = createStyles((theme) => ({
    footer: {
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        backgroundColor: '#ff7f4d',
    },

    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',

        [theme.fn.smallerThan('sm')]: {
            justifyContent: 'center',
            marginBottom: theme.spacing.md,
        },
    },

    linksContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
    },

    linkGroup: {
        marginRight: theme.spacing.lg,

        [theme.fn.smallerThan('sm')]: {
            marginRight: 0,
            marginBottom: theme.spacing.sm,
        },
    },

    linkTitle: {
        fontSize: rem(16),
        fontWeight: 700,
        marginBottom: theme.spacing.sm,
        color: 'white',
    },

    link: {
        display: 'block',
        color: 'white',
        fontSize: rem(14),
        paddingTop: rem(3),
        paddingBottom: rem(3),

        '&:hover': {
            textDecoration: 'underline',
        },
    },

    imagesContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',

        [theme.fn.smallerThan('sm')]: {
            alignItems: 'center',
        },
    },

    image: {
        width: rem(120),
        height: 'auto',
        marginBottom: theme.spacing.sm,

        [theme.fn.smallerThan('sm')]: {
            width: rem(100),
        },
    },

    socialContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.sm,

        [theme.fn.smallerThan('sm')]: {
            justifyContent: 'center',
        },
    },

    socialIcon: {
        color: 'white',

        '&:hover': {
            color: theme.colors.gray[2],
        },
    },

    bottomText: {
        textAlign: 'center',
        color: 'white',
        fontSize: rem(12),
        marginTop: theme.spacing.md,
    },
}));

interface FooterLinksProps {
    data: {
        title: string;
        links: { label: string; link: string }[];
    }[];
}

const LandingFooter = ({ data }: FooterLinksProps) => {
    const { classes } = useStyles();

    const groups = data.map((group) => (
        <Box className={classes.linkGroup} key={group.title}>
            <Title className={classes.linkTitle}>{group.title}</Title>
            {group.links.map((link, index) => (
                <Text<'a'>
                    key={index}
                    className={classes.link}
                    component="a"
                    href={link.link}
                    onClick={(event) => event.preventDefault()}
                >
                    {link.label}
                </Text>
            ))}
        </Box>
    ));

    return (
        <footer className={classes.footer}>
            <Container size="xl">
                <Grid gutter="md" align="flex-start">
                    {/* Logo */}
                    <Grid.Col span={12} sm={4} className={classes.logo}>
                        <BrandName />
                    </Grid.Col>

                    {/* Links */}
                    <Grid.Col span={12} sm={4}>
                        <Box className={classes.linksContainer}>
                            {groups}
                        </Box>
                    </Grid.Col>

                    {/* Social Networks Images */}
                    <Grid.Col span={12} sm={4}>
                        <Box className={classes.imagesContainer}>
                            <Image
                                src="https://www.kairapp.com/wp-content/uploads/2023/09/Logos-corfo-01-1024x151.png"
                                alt="Corfo"
                                className={classes.image}
                            />

                            <Text size="sm" color='white' align='center' weight={700} className={classes.bottomText}>
                                Encuéntranos en nuestras redes sociales
                            </Text>
                            <Group spacing="xs" className={classes.socialContainer}>
                                <ActionIcon component="a" href="#" target="_blank" className={classes.socialIcon}>
                                    <IconBrandTwitter size="20" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon component="a" href="#" target="_blank" className={classes.socialIcon}>
                                    <IconBrandFacebook size="20" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon component="a" href="#" target="_blank" className={classes.socialIcon}>
                                    <IconBrandInstagram size="20" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon component="a" href="#" target="_blank" className={classes.socialIcon}>
                                    <IconBrandLinkedin size="20" stroke={1.5} />
                                </ActionIcon>
                            </Group>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Container>
        </footer>
    );
}

export default LandingFooter;