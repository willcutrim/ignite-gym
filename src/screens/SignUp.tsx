
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '@services/api';

import { AppError } from '@utils/AppError';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { AuthNavvigatorRoutesProps } from '@routes/auth.routes';
import { useState } from 'react';
import { useAuth } from '@hooks/useAuthe';


type FormDataProps = {
    name: string;
    email: string;
    password: string;
    confirmar_senha: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe seu e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe sua senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    confirmar_senha: yup.string().required('confirme a senha.').oneOf([yup.ref('password'), null], 'Senha diferente.'),
})

export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();

    const { signIn } = useAuth();

    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true);

	        await api.post('/users', {name, email, password });

            await signIn(email, password);
	        
        } catch (error) {

            setIsLoading(false);

            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel criar a conta. Tente novamente mais tarde.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    resizeMode='contain'
                    position="absolute"
                />
                <Center my={24}>
                    <LogoSvg />

                    <Text color="gray.100" fontSize='sm'>
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Crie sua conta
                    </Heading>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder='Nome'
                                onChangeText={onChange}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha'
                                onChangeText={onChange}
                                secureTextEntry
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirmar_senha"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Confirmar senha'
                                onChangeText={onChange}
                                secureTextEntry
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                errorMessage={errors.confirmar_senha?.message}
                                returnKeyType="send"
                            />
                        )}
                    />

                    <Button
                        title='Criar e acessar'
                        onPress={handleSubmit(handleSignUp)}
                        isLoading={isLoading}
                    />
                </Center>

                <Button
                    title='Voltar para o login'
                    variant="outline"
                    mt={24}
                    onPress={handleGoBack}
                />
            </VStack>
        </ScrollView>

    );
}