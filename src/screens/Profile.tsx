import { useState } from 'react';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { TouchableOpacity } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import * as FileSystem from 'expo-file-system';


const PHOT0_SIZE = 33;

export function Profile() {

    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/willcutrim.png');

    const toast = useToast();

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true);

        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) {
                return;
            }

            if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
                    return toast.show({
                        title: "Imagem muito gande. Escolha uma de até 5MB.",
                        placement: 'top',
                        bgColor: "red.500"
                    });
                    
                }

                setUserPhoto(photoSelected.assets[0].uri);
                toast.show({
                    title: "Imagem alterada com sucesso.",
                    placement: 'top',
                    bgColor: "green.500"
                });
            }

        } catch (error) {
            console.log(error);
        } finally{
            setPhotoIsLoading(false);
        }

    }

    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />
            <ScrollView>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={PHOT0_SIZE}
                                h={PHOT0_SIZE}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />
                            :
                            <UserPhoto
                                source={{ uri: userPhoto }}
                                size={PHOT0_SIZE}
                                alt="imagem de perfil"
                            />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input
                        bg="gray.600"
                        placeholder='Nome'
                    />

                    <Input
                        bg="gray.600"
                        placeholder='E-mail'
                        isDisabled
                    />
                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color="gray.200" fontSize="md" fontFamily="heading">
                        Alterar senha
                    </Heading>

                    <Input
                        bg="gray.600"
                        placeholder='Senha antiga'
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder='Nova senha'
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder='Confirme nova senha'
                        secureTextEntry
                    />

                    <Button
                        title="Atualizar"
                        mt={4}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    );
}