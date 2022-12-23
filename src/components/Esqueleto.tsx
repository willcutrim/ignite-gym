import { Box, HStack, Skeleton, VStack } from "native-base";

export function Esqueleto() {
    return (
        <VStack p={8}>
            <Skeleton
                w="full"
                h={80}
                startColor="gray.500"
                endColor="gray.400"
                rounded="lg"
            />
            <Box bg="gray.600" rounded="md" pb={4} px={4} mt={3}>
                <HStack justifyContent="space-around" alignItems="center" mb={6} mt={5}>
                    <Skeleton
                        w={75}
                        h={1}
                        startColor="gray.500"
                        endColor="gray.400"
                    />
                    <Skeleton
                        w={75}
                        h={1}
                        startColor="gray.500"
                        endColor="gray.400"
                    />
                </HStack>
                <Skeleton
                    
                    w="full"
                    h={14}
                    startColor="gray.500"
                    endColor="gray.400"
                    rounded="lg"
                />
            </Box>
        </VStack>
    );
}