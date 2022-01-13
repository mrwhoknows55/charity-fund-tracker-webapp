import { Avatar, Center, Heading, HStack, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';

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
            size={'2xl'}
            src={props.avatarUrl}
            alt={'Avatar Alt'}
            pos={'relative'}
          />
        </Center>
        <HStack width={'40vw'} justifyContent={'space-between'}>
          <VStack spacing={2} padding={10} alignItems={'flex-start'}>
            <Heading fontSize={'2xl'}>
              {props.name}
            </Heading>
            <Text as='i' fontSize='sm'>
              {props.date}
            </Text>
          </VStack>
          <Text as='b' padding={10} fontSize='4xl'>
            $ {props.value}
          </Text>
        </HStack>
      </Stack>
    </>
  );
}
