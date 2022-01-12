import { Center, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
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
    {/*<Navbar />*/}
    <VStack spacing={8}>
      <Center py={12} marginTop={90}>
        <SimpleGrid columns={4} spacing={10}>
          <Heading>
            {charity.name}
          </Heading>
        </SimpleGrid>
      </Center>
    </VStack>
  </>);
}

export default CharityDetails;
