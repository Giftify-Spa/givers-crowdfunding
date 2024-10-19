import { ActionIcon, Container, createStyles, Group, Image, rem, Stack, Text } from '@mantine/core';
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTwitter
} from '@tabler/icons-react';
import { BrandName } from "./index";

const useStyles = createStyles((theme) => ({
    footer: {
        paddingTop: `calc(${theme.spacing.xl} * 2)`,
        paddingBottom: `calc(${theme.spacing.xl} * 2)`,
        backgroundColor: '#ff7f4d',
    },

    logo: {
        maxWidth: rem(200),

        [theme.fn.smallerThan('md')]: {
            maxWidth: '40%'
        },

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
    },

    description: {
        marginTop: rem(5),

        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.xs,
            textAlign: 'center',
        },
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
    },

    groups: {
        display: 'flex',
        flexWrap: 'wrap',

        [theme.fn.smallerThan('md')]: {
            marginLeft: 12
        },

        [theme.fn.smallerThan('sm')]: {
            display: 'flex',
            width: '92vw',
            marginTop: theme.spacing.sm
        },
    },

    wrapper: {
        width: rem(200),

        [theme.fn.smallerThan('md')]: {
            margin: `${theme.spacing.sm} 0`,
        },

        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },

    link: {
        display: 'block',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : 'white',
        fontSize: theme.fontSizes.sm,
        paddingTop: rem(3),
        paddingBottom: rem(3),

        '&:hover': {
            textDecoration: 'underline',
        },
    },

    title: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        marginBottom: `calc(${theme.spacing.xs} / 2)`,
        color: 'white',
    },

    afterFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        // paddingTop: theme.spacing.xl,
        // paddingBottom: theme.spacing.xl,
    },

    social: {
        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.xs,
        },
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

    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text<'a'>
                key={index}
                className={classes.link}
                component="a"
                href={link.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        );
    });

    return (
        <footer className={classes.footer}>
            <Container className={classes.inner} size="lg">
                <div className={classes.logo}>
                    <Stack align="flex-start">
                        <BrandName />
                    </Stack>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter} size="xl">
                <div
                    style={{
                        backgroundColor: '#08857f',
                        flex: 0.75,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            src="https://www.kairapp.com/wp-content/uploads/2023/09/Logos-corfo-01-1024x151.png"
                            alt="Corfo"
                            style={{ width: '100%', height: 'auto', maxWidth: '720px', maxHeight: '100px' }} />
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: '#ff7f4d',
                        flex: 0.25,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Text size="sm" color='white' align='center' weight={'700'}>
                        Buscanos en nuestras redes sociales
                    </Text>
                    <Group spacing={0} className={classes.social} position="center" noWrap>
                        <ActionIcon size="lg" component="a" href="#" target="_blank">
                            <IconBrandTwitter color='white' size="20" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" component="a" href="#" target="_blank">
                            <IconBrandFacebook color='white' size="20" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" component="a" href="#" target="_blank">
                            <IconBrandInstagram color='white' size="20" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" component="a" href="#" target="_blank">
                            <IconBrandLinkedin color='white' size="20" stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </div>
            </Container>
        </footer>
    );
}

export default LandingFooter;