import { Box, Center, Flex, Heading, HStack, Image, SimpleGrid, Square, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function CharityDetails() {
  const { username } = useParams();
  const [charity, setCharity] = useState({});

  useEffect(() => {
    axios.get(`https://fundtracking.herokuapp.com/charity/${username}`)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setCharity(response.data.charity);
        }
      }).catch((err) => {
      alert('Something went wrong');
      console.log('Error: ' + err.message);
    });
  }, []);

  return (<>
    <VStack spacing={8}>
      <VStack py={'2vh'} marginTop={'2vh'}>
        <Flex px={'2vw'} w={'100vw'} h={'35vh'} color='white'>
          <Flex>
            <HStack spacing={'5vw'}>
              <Image marginStart={'2vw'} w='12vw' src={charity.profile_image} borderRadius='full' />
              <VStack alignItems={'flex-start'}>
                <Heading mb={'2vh'}>
                  {charity.name}
                </Heading>
                <Text>
                  Founded on: {charity.founded_in}
                </Text>
                <Text>
                  Total Funding: {charity.total_fundings}
                </Text>
                <Text>
                  Total expenditure: {charity.total_expenditure}
                </Text>
              </VStack>
            </HStack>
          </Flex>
        </Flex>
      </VStack>
    </VStack>
  </>);
}

export default CharityDetails;
