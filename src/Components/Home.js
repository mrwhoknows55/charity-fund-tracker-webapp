import React, { Component } from 'react';
import {
  VStack, Heading,
} from '@chakra-ui/react';

class Home extends Component {
  render() {
    return (<>
      <VStack spacing={8}>
        <Heading as={'h1'}>Charity Fund Tracking Web App</Heading>
      </VStack>
    </>);
  }
}

export default Home;
