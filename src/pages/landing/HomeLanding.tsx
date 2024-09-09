import HeroSection from "../../sections/Home/Hero.tsx";
import { Box, BoxProps, Container, TextProps, TitleProps } from "@mantine/core";
import TestimonialsSection from "../../sections/Home/Testimonials.tsx";
import GiversLayoutGuest from "../../layout/GiversLayoutGuest.tsx";
import CampaignsLandingPage from "../CampaignsLanding.tsx";
import CategoriesSection from "../../sections/Home/Categories.tsx";
import DonationsSection from "../../sections/Home/Donations.tsx";
import ServicesSection from "../../sections/Home/Services.tsx";
import SubtitleSection from "../../sections/Home/Subtitle.tsx";

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
                    <CampaignsLandingPage />
                    <DonationsSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                    <ServicesSection boxProps={boxProps} />
                    <SubtitleSection boxProps={boxProps} titleProps={titleProps} subtitleProps={subTitleProps} />
                    <TestimonialsSection boxProps={boxProps} titleProps={titleProps} />
                </Container>
            </Box>
        </GiversLayoutGuest>
    );
};

export default HomeLanding;