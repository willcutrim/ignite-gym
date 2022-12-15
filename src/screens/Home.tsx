import { HStack, VStack, FlatList, Heading, Text } from 'native-base';
import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { useState } from 'react';
import { ExerciseCard } from '@components/ExerciseCard';


export function Home(){

    const [groups, setGroups] = useState(['costa', 'ombro', 'peito', 'tríceps']);
    const [groupSelected, setGroupSelected] = useState('costa');

    const [exercicios, setExercicios] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra']);


    return(
        <VStack flex={1}>
            <HomeHeader/>

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({item}) => (
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
                maxH={10}
            />
            
            <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color='gray.200' fontSize='md'>
                        Exercícios
                    </Heading>

                    <Text color='gray.200' fontSize='sm'>
                        {exercicios.length}
                    </Text>
                </HStack>
                
                <FlatList
                    data={exercicios}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCard />
                    )}
                    showsHorizontalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }}
                />
            </VStack>
        </VStack>
    );
}