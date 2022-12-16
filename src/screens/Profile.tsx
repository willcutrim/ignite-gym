import { useState } from 'react';
import { Center, ScrollView, VStack, Skeleton, Text, Heading } from 'native-base';


import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { TouchableOpacity } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const PHOT0_SIZE = 33;

export function Profile(){

    const [ photoIsLoading, setPhotoIsLoading ] = useState(false);

    return(
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
                                source={{ uri: 'https://github.com/willcutrim.png' }}
                                size={PHOT0_SIZE} 
                                alt="imagem de perfil"
                            />
                    }
                <TouchableOpacity>
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
                   <Heading color="gray.200" fontSize="md">
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