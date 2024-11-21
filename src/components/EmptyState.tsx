import { Stack, Text, Title } from "@mantine/core"


interface EmptyStateProps {
    title: string;
    description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
    return (
        <Stack align="center" spacing="md" mt="xl">
            {/* <Image src={imageUrl} alt="Estado vacío" width={150} height={150} /> */}
            <Title order={3} align="center">{title}</Title>
            <Text align="center" color="dimmed">{description}</Text>
        </Stack>
    )
}

export default EmptyState