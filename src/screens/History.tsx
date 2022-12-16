import { VStack, Heading, SectionList, Text } from 'native-base';
import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { useState } from 'react';

export function History(){

    const [exercicios, setExercicios] = useState([
            {
                title: "26.08.22",
                data: ["Puxada frontal", "Remada unilateral"], 
            },
            {
                title: "28.08.22",
                data: ["Puxada frontal"], 
            },
    ]);

    return(
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios"/>

            <SectionList 
                sections={exercicios}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <HistoryCard/>
                )}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={exercicios.length === 0 ? {flex: 1, justifyContent:"center"} : null}
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Não há exercícios registrados ainda. {'\n'}
                        Vamos fazer exercícios hoje?
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />
        </VStack>
    );
}