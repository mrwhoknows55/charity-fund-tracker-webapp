import { Avatar, Center, HStack, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';

export default function DonationCard(props) {
  return (
    <>
      <Stack
        borderWidth='1px'
        borderRadius='lg'
        w={{ sm: '100%', md: '50rem' }}
        height={{ sm: '476px', md: '10rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}>
        <Center>
          <Avatar
            size={'xl'}
            src={props.avatarUrl}
            alt={'Avatar Alt'}
            mb={4}
            pos={'relative'}
          />
        </Center>
        <HStack width={'40vw'} justifyContent={'space-between'}>
          <VStack spacing={2} padding={10}>
            <Text as='b' fontSize='xl'>
              { props.name }
            </Text>
            <Text as='i' fontSize='sm'>
              { props.date }
            </Text>
          </VStack>
          <Text as='b' padding={10} fontSize='4xl' align='left'>
            $ { props.value }
          </Text>
        </HStack>
      </Stack>
    </>
  );
}
