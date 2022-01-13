import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function Admin() {
  const history = useHistory();
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const access_token = window.sessionStorage.getItem("access_token");
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
    const access_token = window.sessionStorage.getItem("access_token");
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
        <h1>NGO Requests</h1>
        <Center py={5} marginTop={100}>
          <Flex color='white' spacing='20px'>
            {/* --------------------- NGO REQUEST BOX START----------------------------- */}
            <Box
              w='1100px'
              bg={useColorModeValue('gray.200', 'gray.700')}
              padding='15px'
              margin='10px'
            >
              <Heading
                textColor={useColorModeValue('gray.900', 'gray.100')}
                marginBottom='15px'
                // font-Weight='xl'
                zIndex={4}
              >
                NGO Requests
              </Heading>

              <SimpleGrid columns={1} spacingX='40px' spacingY='20px'>
                {charities.map(charity => (
                  <React.Fragment key={charity.charity_id}>
                    <Box bg={'gray.500'} height='130px' borderRadius='15px'>
                      <Flex justifyContent={'space-between'}>
                        <div>
                          <Text
                            fontSize='3xl'
                            fontFamily={'mono'}
                            marginLeft={'20px'}
                            marginTop={'5px'}
                            textColor={'black'}
                          >
                            {charity.name}
                          </Text>
                          <Text
                            fontSize='xl'
                            fontStyle={'italic'}
                            marginLeft={'15px'}
                            textColor={'black'}
                          >
                            {charity.requested_time}
                          </Text>

                          {/* TODO : Align */}
                          <a href={`/charity/${charity.username}`}>
                            <Button colorScheme='teal' variant='outline'>
                              Details
                            </Button>
                          </a>
                        </div>
                        <Stack spacing={3} align='center' padding={'15px'}>
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
                            colorScheme='red'
                            variant='solid'
                            fontSize={'22px'}
                            onClick={e =>
                              acceptCharity(e, charity.username, false)
                            }
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Flex>
                    </Box>
                  </React.Fragment>
                ))}
              </SimpleGrid>
            </Box>

            {/* --------------------- NGO REQUEST BOX END----------------------------- */}

            {/* ---------------------   RECENT TRANSACTION BOX START ----------------------------- */}
            <Box
              bg={useColorModeValue('gray.300', 'gray.900')}
              w='700px'
              size='150px'
              padding='15px'
              margin='10px'
              marginLeft='30px'
            >
              <Heading marginBottom='15px'>Recent Transactions </Heading>

              <SimpleGrid columns={1} spacingX='40px' spacingY='20px'>
                <Box
                  bg={useColorModeValue('white', 'gray.600')}
                  height='80px'
                  borderRadius='15px'
                >
                  <h1>... This Field Under Construction ...</h1>
                </Box>
              </SimpleGrid>
            </Box>

            {/* ---------------------   RECENT TRANSACTION BOX END ----------------------------- */}
          </Flex>
        </Center>
      </VStack>
    </>
  );
}
