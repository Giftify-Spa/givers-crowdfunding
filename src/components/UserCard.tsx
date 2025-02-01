import { Avatar, Button, Flex, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { User } from '../interfaces/User';
import { Link } from 'react-router-dom';

interface IProps extends PaperProps {
    responsibleData: User
}

const UserCard = ({ responsibleData, ...others }: IProps) => {

    const { id, name, email, photoURL } = responsibleData;

    return (
        <Paper{...others}>
            <Flex gap="lg" align="center">
                <Avatar src={photoURL ? photoURL : ''} size={80} radius={120} />
                <Stack spacing="xs" align="flex-start">
                    <Button component={Link} to={`/foundation/${id}`}>
                        <Text ta="center" fz="lg" weight={500}>
                            {name}
                        </Text>
                    </Button>
                    <Text ta="center" c="dimmed" fz="sm">
                        {email}
                    </Text>
                </Stack>
            </Flex>
        </Paper>
    );
}

export default UserCard;
