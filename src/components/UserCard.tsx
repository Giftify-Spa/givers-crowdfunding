import { Avatar, Flex, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { User } from '../interfaces/User';

interface IProps extends PaperProps {
    responsibleData: User
}

const UserCard = ({ responsibleData, ...others }: IProps) => {

    const { name, email, photoURL } = responsibleData;

    return (
        <Paper{...others}>
            <Flex gap="lg" align="center">
                <Avatar src={photoURL ? photoURL : ''} size={120} radius={120} />
                <Stack spacing="xs" align="flex-start">
                    <Text ta="center" fz="lg" weight={500}>
                        {name}
                    </Text>
                    <Text ta="center" c="dimmed" fz="sm">
                        {email}
                    </Text>
                </Stack>
            </Flex>
        </Paper>
    );
}

export default UserCard;
