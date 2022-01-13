import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function Admin() {
  useHistory();
  const [charities, setCharities] = useState([]);
// const [profileImg, setProfileImg] = useState(
  //   'https://avatars.dicebear.com/api/male/username.svg'
  // );

  const dailyTransactions = [
    {
      name: 'Manohar Shatri',
      date: '15-01-2022',
      value: '7,80,000',
      to: 'Being Human',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNOhpV67XSI4Vz5Z_L7XoWiH7UzZQDBTzS3g&usqp=CAU',
    },
    {
      name: 'Anonymous',
      date: '15-01-2022',
      value: '47,000',
      to: 'Being Human',
    },
    {
      name: 'Rajiv Patil',
      date: '15-01-2022',
      value: '3,00,000',
      to: 'Palak Charitable Trust',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNOhpV67XSI4Vz5Z_L7XoWiH7UzZQDBTzS3g&usqp=CAU',
    },
  ];

  useEffect(() => {
    const access_token = window.sessionStorage.getItem('access_token');
    axios
      .get('https://fundtracking.herokuapp.com/admin/charities', {
        headers: { Authorization: 'Bearer ' + access_token },
      })
      .then(response => {
        console.log(response);
        if (response.data.status) {
          setCharities(response.data.charities);
          console.log(response.data.charities);
        }
      })
      .catch(err => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
      });
  }, []);

  function acceptCharity(e, username, isAccepted) {
    const access_token = window.sessionStorage.getItem('access_token');
    axios
      .post(
        'https://fundtracking.herokuapp.com/admin/charity/verify',
        { username: username, accepted: isAccepted },
        { headers: { Authorization: 'Bearer ' + access_token } },
      )
      .then(response => {
        console.log(response);
        if (response.data.status) {
          window.location.reload();
        }
      })
      .catch(err => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
      });
  }

  return (
    <>
      <VStack spacing={8}>
        <Center py={5} marginTop={100}>
          <Flex color='white' spacing='20px'>
            {/* --------------------- NGO REQUEST BOX START----------------------------- */}
            <VStack
              spacing={8}
              w={{ sm: '100%', md: '68rem' }}
              bg={useColorModeValue('gray.200', 'gray.700')}
              padding='15px'
              borderRadius={10}
            >
              <Heading
                textColor={useColorModeValue('gray.900', 'gray.100')}
                zIndex={4}
                marginTop={'2vh'}
              >
                Charity Requests
              </Heading>

              <SimpleGrid columns={1} spacingX='40px' spacingY='20px'>
                {charities.map(charity => (
                  <React.Fragment key={charity.charity_id}>
                    <Stack
                      borderWidth='1px'
                      borderRadius='xl'
                      marginLeft={'8PX'}
                      w={{ sm: '100%', md: '65rem' }}
                      height={{ sm: '476px', md: '9rem' }}
                      direction={{ base: 'column', md: 'row' }}
                      boxShadow={'2xl'}
                      bg='gray.100'
                      padding={4}
                    >
                      <Center>
                        <Avatar
                          size={'2xl'}
                          padding={'1vh'}
                          background={'#ffffff00'}
                          src={
                            charity.profile_image
                              ? charity.profile_image
                              : 'https://avatars.dicebear.com/api/male/username.svg'
                          }
                          alt={'Avatar Alt'}
                          pos={'relative'}
                        />
                      </Center>

                      <HStack width={'50vw'} justifyContent={'space-between'}>
                        <VStack spacing={2} padding={10} alignItems={'flex-start'}>
                          <Text as='b' fontSize='2xl' textColor={'black'}>
                            {charity.name}
                          </Text>
                          <Text as='i' fontSize='md' textColor={'black'}>
                            Date: {charity.requested_time}
                          </Text>
                          <a href={`/charity/${charity.username}`}>
                            <Button colorScheme='teal' variant='outline'>
                              Details
                            </Button>
                          </a>
                        </VStack>
                        <Stack spacing={3} padding={5}>
                          <Button
                            colorScheme='teal'
                            variant='solid'
                            fontSize={'22px'}
                            onClick={e =>
                              acceptCharity(e, charity.username, true)
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            colorScheme={'red'}
                            variant='solid'
                            fontSize={'22px'}
                            onClick={e =>
                              acceptCharity(e, charity.username, false)
                            }
                          >
                            Reject
                          </Button>
                        </Stack>
                      </HStack>
                    </Stack>
                  </React.Fragment>
                ))}
              </SimpleGrid>
            </VStack>

            {/* --------------------- NGO REQUEST BOX END----------------------------- */}

            {/* ---------------------   RECENT TRANSACTION BOX START ----------------------------- */}

            <VStack
              borderRadius={'10'}
              bg={useColorModeValue('gray.200', 'gray.700')}
              w='700px'
              size='150px'
              marginLeft='30px'
              spacing={8}
            >
              <Heading marginTop={'4vh'} textColor={useColorModeValue('gray.900', 'gray.100')}>Recent Transactions </Heading>

              <SimpleGrid columns={1} spacingX='40px' spacingY='20px'>
                {dailyTransactions.map(charity => (
                  <React.Fragment key={charity.charity_id}>
                    <Stack
                      borderWidth='1px'
                      borderRadius='xl'
                      marginLeft={'8PX'}
                      w={{ sm: '100%', md: '40rem' }}
                      height={{ sm: '476px', md: '9rem' }}
                      direction={{ base: 'column', md: 'row' }}
                      boxShadow={'2xl'}
                      bg='gray.200'
                      padding={4}
                    >
                      <Center>
                        <Avatar
                          size={'2xl'}
                          padding={'1vh'}
                          background={'#ffffff00'}
                          src={
                            charity.profile_image
                              ? charity.profile_image
                              : 'https://avatars.dicebear.com/api/male/username.svg'
                          }
                          alt={'Avatar Alt'}
                          pos={'relative'}
                        />
                      </Center>
                      <HStack width={'45vw'} justifyContent={'space-between'}>
                        <VStack alignItems={'flex-start'}>
                          <Text as='b' fontSize='2xl' textColor={'black'}>
                            {charity.name}
                          </Text>
                          <Text as='b' fontSize='md' textColor={'black'}>
                            Donated to {charity.to}
                          </Text>
                          <Text as='i' fontSize='md' textColor={'black'}>
                            Date: {charity.date}
                          </Text>
                        </VStack>
                        <Stack width={'10vw'} spacing={1} padding={2}>
                          <Text textColor={'teal'} as='b' padding={5} fontSize='3xl' align='left'>
                            ₹{charity.value}
                          </Text>
                        </Stack>
                      </HStack>
                    </Stack>
                  </React.Fragment>
                ))}
              </SimpleGrid>
            </VStack>

            {/* ---------------------   RECENT TRANSACTION BOX END ----------------------------- */}
          </Flex>
        </Center>
      </VStack>
    </>
  );
}
