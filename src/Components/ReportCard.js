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
        borderWidth="2px"
        borderRadius="lg"
        w={'40vw'}
        height={'14vh'}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}
      >
        <HStack width={'40vw'} justifyContent={'space-between'} m="1vw">
          <VStack spacing={2} align={'start'} m="1vw">
            <Skeleton isLoaded={isLoaded} maxWidth={'20vw'}>
              <Text
                as="b"
                align={'left'}
                fontSize={{ sm: 'lg', md: 'xl' }}
                noOfLines={2}
              >
                {props.title}
              </Text>
            </Skeleton>
            <SkeletonText noOfLines={1} isLoaded={isLoaded}>
              <Text as="i" fontSize="sm">
                {props.date}
              </Text>
            </SkeletonText>
          </VStack>
          <SkeletonText noOfLines={1} isLoaded={isLoaded} m="2" maxW={"12vw"}>
            <Text
              as="b"
              fontSize={{ sm: 'lg', md: '2xl' }}
              noOfLines={1}
              align="left"
              m="1vw"
            >
              $ {props.value}
            </Text>
          </SkeletonText>
        </HStack>
      </Stack>
    </>
  );
}
