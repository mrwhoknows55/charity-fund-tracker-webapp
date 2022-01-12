import React, { Component } from 'react';
import {
  VStack,
} from '@chakra-ui/react';

class Home extends Component {
  render() {
    return (<>
      <VStack spacing={8}>
        <div style={{'marginTop':"90px"}}>
          <h1>About Page</h1>
        </div>
        <h3>About Page</h3>
      </VStack>
    </>);
  }
}

export default Home;
