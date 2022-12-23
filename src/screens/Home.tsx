import { HStack, VStack, FlatList, Heading, Text, useToast } from 'native-base';
import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { useState, useEffect, useCallback } from 'react';
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { ExercisesDTO } from '@dtos/ExercisesDTO';
import { Loading } from '@components/Loading';


export function Home() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [groupSelected, setGroupSelected] = useState('antebraço');

    const [exercicios, setExercicios] = useState<ExercisesDTO[]>([]);

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate('exercise', {exerciseId});
    }

    async function fetchGroup() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi pissivel carregar os grupos musculares.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);

            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercicios(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi pissivel carregar os exercícios.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroup();

    }, [])

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]));


    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={groupSelected === item}
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8 }}
                my={10}
                minH={10}
                maxH={10}
            />
            {
                isLoading ? <Loading /> :

                    <VStack flex={1} px={8}>
                        <HStack justifyContent="space-between" mb={5}>
                            <Heading color='gray.200' fontSize='md' fontFamily="heading">
                                Exercícios
                            </Heading>

                            <Text color='gray.200' fontSize='sm'>
                                {exercicios.length}
                            </Text>
                        </HStack>

                        <FlatList
                            data={exercicios}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ExerciseCard
                                    onPress={() => handleOpenExerciseDetails(item.id)}
                                    data={item}
                                />
                            )}
                            showsHorizontalScrollIndicator={false}
                            _contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </VStack>
            }
        </VStack>
    );
}