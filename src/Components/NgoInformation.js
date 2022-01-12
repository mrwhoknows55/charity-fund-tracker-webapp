import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import {
  VStack,
} from '@chakra-ui/react';

class NgoInformation extends Component {
  render() {
    return (<>
      <VStack spacing={8}  >
        <div style={{'marginTop':"90px"}}>
            <h1 color='red' >NGO Page</h1>
        </div>
            
        <hr/>
      </VStack>
    </>);
  }
}

export default NgoInformation;
