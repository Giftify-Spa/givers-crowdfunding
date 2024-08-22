import {Box, BoxProps, TextProps, Title, TitleProps} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import testimonialsData from "../../data/Testimonials.json";
import {TestimonialsCard} from "../../components";

interface IProps {
    boxProps: BoxProps
    titleProps?: TitleProps,
    subtitleProps?: TextProps
}

const TestimonialsSection = ({boxProps, titleProps}: IProps) => {
    const slides = testimonialsData.data.map(t => (
        <Carousel.Slide key={t.id}><TestimonialsCard data={t}/></Carousel.Slide>))

    return (
        <Box {...boxProps}>
            <Title {...titleProps} style={{ color: '#684DF0'}} align="center">Testimonios de nuestros asociados</Title>
            <Carousel slideSize="95%" align="center" slideGap="lg">
                {slides}
            </Carousel>
        </Box>
    );
};

export default TestimonialsSection;
