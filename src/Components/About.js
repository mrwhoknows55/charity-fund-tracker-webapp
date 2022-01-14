import React, { Component } from 'react';
import {
  VStack,Heading, Box, Image, Flex, Badge, Text} from '@chakra-ui/react';

class Home extends Component {
  render() {
    return (<>
    <VStack spacing={8}>
      <Box p="5" maxW="1000px" borderWidth="15px"  marginTop={'20vh'} borderColor={'lightteal'}>
        <Heading mb={5}>About This Website</Heading>
        <Flex align="z" mt={2}>
          <Badge fontSize="xl" ml={4} colorScheme="red" >Introduction</Badge>
        </Flex>
        <Text mt={2} ml={55} textAlign="justify">
        &emsp;&emsp;The problem of mistrust of donors and overloading of funds can be solved by organizing an external database, records in which are recorded in the blockchain.
        This is where comes this platform, a platform based on blockchain technology that can help non-profit organizations, foundations, volunteers and social entrepreneurs in their work and make donation processes transparent and understandable for donors and charitable funds.
        </Text> 
        <Text mt={2} ml={4} textAlign="left" fontSize="Med" fontWeight="bold" lineHeight="short" color="red.700">
          Created by :
        </Text>
        <Text mt={2} ml={55} fontWeight="semibold" textAlign="justify">
          Dhananjay Sonar<br/>
          Aditya Sutar<br/>
          Avadhut Tanugade<br/>
          Jay Powar<br/>
          Ajay Powar<br/>
        </Text>
      </Box>
    </VStack>
  </>);
  }
}

export default Home;
