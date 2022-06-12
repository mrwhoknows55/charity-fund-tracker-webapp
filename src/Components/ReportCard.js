import {
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';

export default function ReportCard(props) {
  const isLoaded = props.isLoaded;
  return (
    <>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        w={"40vw"}
        height={"12vh"}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}
      >
        <HStack width={'40vw'} justifyContent={'space-between'} m="1vw">
          <VStack spacing={2} align={'start'} m="1vw">
            <Skeleton isLoaded={isLoaded}>
              <Text as="b" fontSize={{sm:'lg', md:"xl"}}>
                {props.title}
              </Text>
            </Skeleton>
            <SkeletonText noOfLines={1} isLoaded={isLoaded}>
              <Text as="i" fontSize="sm">
                {props.date}
              </Text>
            </SkeletonText>
          </VStack>
          <Skeleton isLoaded={isLoaded} m="2">
            <Text as="b"  fontSize={{sm:'lg', md:"3xl"}} align="left" m="1vw">
              $ {props.value}
            </Text>
          </Skeleton>
        </HStack>
      </Stack>
    </>
  );
}
