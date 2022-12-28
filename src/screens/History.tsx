import { VStack, Heading, SectionList, Text, useToast, Center } from 'native-base';
import { useState, useEffect, useCallback } from 'react';
import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ExercisesDTO } from '@dtos/ExercisesDTO';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { Loading } from '@components/Loading';
import { useAuth } from '@hooks/useAuthe';

export function History() {
    const [isLoading, setIsLoading] = useState(true);

    const toast = useToast();
    const { refreshedToken } = useAuth();

    const [exercicios, setExercicios] = useState<HistoryByDayDTO[]>([]);


    async function fetchHistory() {
        try {
            setIsLoading(true);

            const response = await api.get('/history');
            setExercicios(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi pissivel caregar o histório.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, [refreshedToken]));
    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios" />

            {isLoading ? <Loading />
                : (exercicios?.length > 0 ?
                    <SectionList
                        sections={exercicios}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <HistoryCard data={item} />
                        )}
                        renderSectionHeader={({ section }) => (
                            <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                                {section.title}
                            </Heading>
                        )}
                        px={8}
                        contentContainerStyle={exercicios.length === 0 ? { flex: 1, justifyContent: "center" } : null}
                        showsVerticalScrollIndicator={false}
                    />
                    :
                    <Center flex={1}>
                        <Text color="gray.100" textAlign="center">
                            Não há exercícios registrados ainda. {'\n'}
                            Vamos fazer exercícios hoje?
                        </Text>
                    </Center>
                )
            }
        </VStack>
    );
}