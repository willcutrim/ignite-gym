import { TouchableOpacity } from 'react-native';
import { VStack, Icon, HStack, Heading, Text, Image, Box, ScrollView, useToast } from 'native-base';

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useEffect, useState } from 'react';
import { api } from '@services/api';
import { ExercisesDTO } from '@dtos/ExercisesDTO';
import { Loading } from '@components/Loading';
import { Esqueleto } from '@components/Esqueleto';

type RoutesParamsProps = {
    exerciseId: string;
}

export function Exercise() {
    
    const [ exercise, setExercise ] = useState<ExercisesDTO>({} as ExercisesDTO);
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const [isLoading, setIsLoading] = useState(true);
    const [submittingRegister, setSubmittingRegister] = useState(false);

    const toast = useToast();
    const route = useRoute();

    const { exerciseId } = route.params as RoutesParamsProps;

    function handleGoBack() {
        navigation.goBack();
    }

    async function fetchExerciseDatails() {
        try {
            setIsLoading(true);
            const response = await api.get(`/exercises/${exerciseId}`);
            setExercise(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi pissivel carregar os detalhes do exercício.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false);
        }
    }

    async function handleExerciseHistoryRegister(){
        try {
            setSubmittingRegister(true);

            await api.post('/history', { exercise_id: exerciseId});

            toast.show({
                title: 'Exercício registrado no seu histórico.',
                placement: 'top',
                bgColor: 'green.700',
            })

            navigation.navigate("history");
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi pissivel registrar o exercício.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setSubmittingRegister(false);
        }
    }

    useEffect(() => {
        fetchExerciseDatails();
    },[exerciseId]);

    return (
        <VStack flex={1}>
            <ScrollView>
                <VStack px={8} bg="gray.600" pt={12}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icon
                            as={Feather}
                            name="arrow-left"
                            color="green.500"
                            size={6}
                        />
                    </TouchableOpacity>

                    <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
                        <Heading color="gray.100" fontSize="lg" flexShrink={1} fontFamily="heading">
                            {exercise.name}
                        </Heading>

                        <HStack alignItems="center">
                            <BodySvg />
                            <Text color="gray.200" ml={1} textTransform="capitalize">
                                {exercise.group}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
            { isLoading ? <Esqueleto/> :
                <VStack p={8}>
                <Box rounded="lg" mb={3} overflow="hidden">
                    <Image
                        w="full"
                        h={80}
                        source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}  
                        alt="imagem do treino"
                        resizeMode="cover"
                        rounded="lg"
                    />
                </Box>
                
                    <Box bg="gray.600" rounded="md" pb={4} px={4}>
                        <HStack justifyContent="space-around" alignItems="center" mb={6} mt={5}>
                            <HStack>
                                <SeriesSvg />
                                <Text color="gray.200" ml={2}>
                                    {exercise.series} series
                                </Text>
                            </HStack>

                            <HStack>
                                <RepetitionsSvg />
                                <Text color="gray.200" ml={2}>
                                {exercise.repetitions} repetições
                                </Text>
                            </HStack>
                        </HStack>

                        <Button
                            title="Marcar como realizado"
                            isLoading={submittingRegister}
                            onPress={handleExerciseHistoryRegister}
                        />
                    </Box>
                </VStack>
            }
            </ScrollView>
        </VStack>
    );
}