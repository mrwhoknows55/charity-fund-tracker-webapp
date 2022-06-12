import {
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

export default function ReportCard(props) {
  return (
    <>
      <Stack
        borderWidth='1px'
        borderRadius='lg'
        w={{ sm: '100%', md: '50rem' }}
        height={{ sm: '476px', md: '8rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}>
        <HStack width={'40vw'} justifyContent={'space-between'}>
          <VStack spacing={2} align={'start'} padding={10}>
            <Text as='b' fontSize='xl' title={props.title}>
              { props.title.substr(0,18) }...{props.title.substr(props.title.length-4, props.title.length)}
            </Text>
            <Text as='i' fontSize='sm'>
              { props.date }
            </Text>
          </VStack>
          <Text as='b' fontSize='2xl' align='left'  padding={10}>
            { props.value }
          </Text>
        </HStack>
      </Stack>
    </>
  );
}
