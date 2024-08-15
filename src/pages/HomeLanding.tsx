import HeroSection from "../sections/Home/Hero.tsx";
import { Text, Box, BoxProps, Container, TextProps, Title, TitleProps } from "@mantine/core";
import { TitleBadge } from "../components/index.ts";
import FeaturesSection from "../sections/Home/Features.tsx";
import StatsSection from "../sections/Home/Stats.tsx";
import JoinUsSection from "../sections/Home/JoinUs.tsx";
import WaysToFundSection from "../sections/Home/WaysToFund.tsx";
import GetStartedSection from "../sections/Home/GetStarted.tsx";
import TestimonialsSection from "../sections/Home/Testimonials.tsx";
import GiversLayoutGuest from "../layout/GiversLayoutGuest.tsx";
import CampaignsPage from "./Campaigns.tsx";
import CategoriesSection from "../sections/Home/Categories.tsx";
import DonationsSection from "../sections/Home/Donations.tsx";

const HomeLanding = (): JSX.Element => {
    const boxProps: BoxProps = {
        mt: 0,
        mb: 0,
        py: 48
    }

    const titleProps: TitleProps = {
        size: 32,
        weight: 800,
        mb: "lg",
        transform: 'capitalize',
        sx: { lineHeight: '40px' }
    }

    const subTitleProps: TextProps = {
        size: 20,
        weight: 700,
        mb: "md",
        sx: { lineHeight: '28px' }
    }

    return (
        <GiversLayoutGuest>
            <Box>
                <HeroSection />
                <Container >
                    <CategoriesSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                    <CampaignsPage />
                    {/* <Box {...boxProps}>
                        <TitleBadge title="About us" />
                        <Title {...titleProps}>more people more impact</Title>
                        <Text {...subTitleProps}>Because together, we can make a real difference. Our volunteers service
                            in a
                            variety of roles according to their skills and interests.</Text>
                    </Box> */}
                    <DonationsSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                    {/* <FeaturesSection boxProps={boxProps} subtitleProps={subTitleProps} /> */}
                    <StatsSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                    <JoinUsSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                </Container>
                <WaysToFundSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                <Container>
                    <TestimonialsSection boxProps={boxProps} titleProps={titleProps} />

                    <GetStartedSection boxProps={boxProps} titleProps={titleProps} />
                </Container>
            </Box>
        </GiversLayoutGuest>
    );
};

export default HomeLanding;