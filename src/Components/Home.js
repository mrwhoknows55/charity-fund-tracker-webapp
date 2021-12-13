import React, { Component } from 'react';
import {
  Heading, Flex,
} from '@chakra-ui/react';

class Home extends Component {
  componentDidMount() {
    window.location.href = "/login";
  }
  render() {
    return (<>
      <Flex spacing={8} justifyContent={'center'}>
        <Flex mt={'5rem'} >
          <Heading as={'h1'}>Charity Fund Tracking Web App</Heading>
        </Flex>
      </Flex>
    </>);
  }
}

export default Home;
