
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AuthNavvigatorRoutesProps } from '@routes/auth.routes';

type FormDataProps = {
    name: string;
    email: string;
    senha: string;
    confirmar_senha: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe seu e-mail.').email('E-mail inválido.'),
    senha: yup.string().required('Informe sua senha.'),
    confirmar_senha: yup.string().required('confirme sua senha.'),
})

export function SignUp() {


    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    }

    function handleSignUp({ name, email, senha, confirmar_senha }: FormDataProps) {
        console.log(`Name: ${name}, \nE-mail: ${email}, \nSenha: ${senha}, \nconfirmar senha: ${confirmar_senha}`);
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
                        name="senha"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha'
                                onChangeText={onChange}
                                secureTextEntry
                                value={value}
                                errorMessage={errors.senha?.message}
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