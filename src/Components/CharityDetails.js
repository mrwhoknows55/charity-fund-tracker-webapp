import { Center, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import React from 'react';


function CharityDetails() {
  const { id } = useParams();

  return (<>
    {/*<Navbar />*/}
    <VStack spacing={8}>
      <Center py={12} marginTop={90}>
        <SimpleGrid columns={4} spacing={10}>
          <Heading>
            {id}
          </Heading>
        </SimpleGrid>
      </Center>
    </VStack>
  </>);
}

export default CharityDetails;
