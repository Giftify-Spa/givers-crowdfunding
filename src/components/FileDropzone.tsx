/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, Image, rem, Text, useMantineTheme } from "@mantine/core";
import { IconAlbum, IconPhotoPlus, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface IFileInputProps extends Pick<DropzoneProps, 'multiple'> {
    label: string
    description: string
    multiple?: boolean,
    handleDropFile?: (files: File[]) => void
    handleRejectFile?: (rejectedFiles: File[]) => void
}

const FileDropzone = ({ label, description, handleDropFile, handleRejectFile, ...others }: IFileInputProps) => {
    const theme = useMantineTheme()
    const [previews, setPreviews] = useState<string[]>([]);

    const handleDrop = (dropFiles: File[]) => {
        if (dropFiles.length > 0) {
            handleDropFile(dropFiles)
            setPreviews(dropFiles.map(file => URL.createObjectURL(file)));
        }
    };

    const handleReject = (rejectedFiles: File[]) => {
        if (rejectedFiles.length > 0) {
            console.log(rejectedFiles);
        }
    }
    return (
        <>
            <Dropzone
                onDrop={(files: any) => handleDrop(files)}
                onReject={(files: any) => handleReject(files)}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                {...others}
            >
                <Group
                    position="center"
                    spacing="xl"
                    style={{ minHeight: rem(120), pointerEvents: 'none' }}
                >
                    <Dropzone.Accept>
                        <IconUpload
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        {others.multiple ?
                            <IconPhotoPlus size="3.2rem" stroke={1.5} /> :
                            <IconAlbum size="3.2rem" stroke={1.5} />
                        }
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            {label || 'Upload your profile picture'}
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            {description || 'This picture will be shown next to your name'}
                        </Text>
                    </div>
                </Group>
            </Dropzone>

            {previews.length > 0 && (
                <>
                    <div style={{ marginTop: 20 }}>
                        <h3>Imágenes Subidas:</h3>
                        <Group>
                            {previews.map((src, index) => (
                                <Image
                                    key={index}
                                    src={src}
                                    alt={`Preview ${index}`}
                                    width={100}
                                    height={100}
                                    fit="cover"
                                    radius="xs"
                                />
                            ))}
                        </Group>
                    </div>
                </>
            )}
        </>
    );
};

export default FileDropzone;
