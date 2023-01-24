import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../Constants';

export default function Admin() {
  useHistory();
  const [charities, setCharities] = useState(require('../data/fakeCharityReq'));
  const [areCharitiesLoaded, setCharitiesLoaded] = useState(false);

  const dailyTransactions = require('../data/fakeTrascations');

  useEffect(() => {
    const access_token = window.sessionStorage.getItem('access_token');
    axios
      .get(`${API_URL}/admin/charities`, {
        headers: { Authorization: 'Bearer ' + access_token },
      })
      .then(response => {
        console.log(response);
        if (response.data.status) {
          setCharities(response.data.charities);
          console.log(`charities: ${JSON.stringify(response.data.charities)}`);
          setCharitiesLoaded(true);
        } else {
          setCharities([]);
        }
      })
      .catch(err => {
        alert('Something went wrong');
        setCharities([]);
        setCharitiesLoaded(true);
        console.log('Error: ' + err.message);
      });
  }, []);

  function acceptCharity(e, username, isAccepted) {
    const access_token = window.sessionStorage.getItem('access_token');
    axios
      .post(
        `${API_URL}/admin/charity/verify`,
        { username: username, accepted: isAccepted },
        { headers: { Authorization: 'Bearer ' + access_token } }
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
      <VStack spacing={8} w="100vw" overflowY={'hidden'}>
        <Center py={5} marginTop={'8vh'}>
          <HStack color="white" w="100vw" overflowY={'hidden'}>
            {/* --------------------- NGO REQUEST BOX START----------------------------- */}
            <VStack
              spacing={8}
              w={'55vw'}
              bg={useColorModeValue('gray.200', 'gray.700')}
              mx="2vw"
              minH="80vh"
              paddingBottom={'4vh'}
              borderRadius={10}
            >
              <Heading
                textColor={useColorModeValue('gray.900', 'gray.100')}
                zIndex={4}
                marginTop={'2vh'}
              >
                Charity Requests
              </Heading>

              <SimpleGrid columns={1} spacingX="40px" spacingY="20px">
                {charities.map(charity => (
                  <React.Fragment key={charity.charity_id}>
                    <Stack
                      borderWidth="1px"
                      borderRadius="xl"
                      w={'50vw'}
                      height={'16vh'}
                      direction={{ base: 'column', md: 'row' }}
                      boxShadow={'2xl'}
                      bg="gray.100"
                      padding={4}
                    >
                      <Center>
                        <SkeletonCircle
                          width={'7vw'}
                          height={'7vw'}
                          alignSelf="center"
                          isLoaded={areCharitiesLoaded}
                        >
                          <Avatar
                            width={'8vw'}
                            height={'8vw'}
                            padding={'1vh'}
                            alignSelf="center"
                            background={'#ffffff00'}
                            src={
                              charity.profile_image
                                ? charity.profile_image
                                : 'https://avatars.dicebear.com/api/male/username.svg'
                            }
                            alt={'Avatar Alt'}
                          />
                        </SkeletonCircle>
                      </Center>

                      <HStack width={'50vw'} justifyContent={'space-between'}>
                        <VStack
                          spacing={2}
                          padding={10}
                          alignItems={'flex-start'}
                        >
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Text as="b" fontSize="2xl" textColor={'black'}>
                              {charity.name}
                            </Text>
                          </Skeleton>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Text as="i" fontSize="md" textColor={'black'}>
                              Date: {charity.requested_time}
                            </Text>
                          </Skeleton>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <a href={`/charity/${charity.username}`}>
                              <Button colorScheme="teal" variant="outline">
                                Details
                              </Button>
                            </a>
                          </Skeleton>
                        </VStack>
                        <Stack spacing={3} padding={5}>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Button
                              colorScheme="teal"
                              variant="solid"
                              fontSize={'22px'}
                              onClick={e =>
                                acceptCharity(e, charity.username, true)
                              }
                            >
                              Accept
                            </Button>
                          </Skeleton>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Button
                              colorScheme={'red'}
                              variant="solid"
                              fontSize={'22px'}
                              onClick={e =>
                                acceptCharity(e, charity.username, false)
                              }
                            >
                              Reject
                            </Button>
                          </Skeleton>
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
              w="45vw"
              mx="2vw"
              minH="80vh"
              spacing={8}
            >
              <Heading
                marginTop={'4vh'}
                textColor={useColorModeValue('gray.900', 'gray.100')}
              >
                Recent Transactions{' '}
              </Heading>

              <SimpleGrid columns={1} spacingY="2vh">
                {dailyTransactions.map(charity => (
                  <React.Fragment key={charity.charity_id}>
                    <Stack
                      borderWidth="1px"
                      borderRadius="xl"
                      w={'38vw'}
                      height={{ sm: '476px', md: '9rem' }}
                      direction={{ base: 'column', md: 'row' }}
                      boxShadow={'2xl'}
                      bg="gray.200"
                      padding={4}
                    >
                      <Center>
                        <SkeletonCircle
                          width={'6vw'}
                          height={'6vw'}
                          alignSelf="center"
                          isLoaded={areCharitiesLoaded}
                        >
                          <Avatar
                            width={'6vw'}
                            height={'6vw'}
                            p={'0.5vw'}
                            background={'#ffffff00'}
                            src={
                              charity.profile_image
                                ? charity.profile_image
                                : 'https://avatars.dicebear.com/api/male/username.svg'
                            }
                            alt={'Avatar Alt'}
                            pos={'relative'}
                          />
                        </SkeletonCircle>
                      </Center>
                      <HStack width={'45vw'} justifyContent={'space-between'}>
                        <VStack alignItems={'flex-start'}>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Text as="b" fontSize="2xl" textColor={'black'}>
                              {charity.name}
                            </Text>
                          </Skeleton>

                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Text as="b" fontSize="md" textColor={'black'}>
                              Donated to {charity.to}
                            </Text>
                          </Skeleton>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Text as="i" fontSize="md" textColor={'black'}>
                              Date: {charity.date}
                            </Text>
                          </Skeleton>
                        </VStack>
                        <Stack width={'10vw'} spacing={1} padding={2}>
                          <Skeleton isLoaded={areCharitiesLoaded}>
                            <Text
                              textColor={'teal'}
                              as="b"
                              padding={5}
                              fontSize="3xl"
                              align="left"
                            >
                              ₹{charity.value}
                            </Text>
                          </Skeleton>
                        </Stack>
                      </HStack>
                    </Stack>
                  </React.Fragment>
                ))}
              </SimpleGrid>
            </VStack>

            {/* ---------------------   RECENT TRANSACTION BOX END ----------------------------- */}
          </HStack>
        </Center>
      </VStack>
    </>
  );
}
