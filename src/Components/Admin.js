import React, { Component } from 'react';
import {
  VStack, Center, SimpleGrid, Box, Flex,Square,Text, Heading, useColorModeValue,Button,Stack
} from '@chakra-ui/react';




export default function Admin() {
  
  return (
    <>
      <VStack spacing={8}>
      <h1>NGO Requests</h1>
      <Center py={5} marginTop={100}>
      
     

      <Flex color='white' spacing='20px' >
        
        {/* --------------------- NGO REQUEST BOX START----------------------------- */}
        <Box w='1100px' 
        bg={useColorModeValue('gray.200', 'gray.700')}
        padding='15px' margin='10px'  >
          
          <Heading textColor={useColorModeValue('gray.900', 'gray.100')}
          marginBottom='15px' 
          // font-Weight='xl'
          zIndex={4}
          >NGO Requests</Heading>


          <SimpleGrid columns={1} spacingX='40px' spacingY='20px'>

            <Box bg={useColorModeValue('white', 'gray.500')} height='130px' borderRadius='15px'>


              <Flex  justifyContent={'space-between'} >
                <div>
                  <Text fontSize='3xl'  fontFamily={'mono'} marginLeft={'20px'} 
                  marginTop={'5px'}  textColor={useColorModeValue('gray.900', 'gray.100')}>
                    Ngo Name 
                  </Text>
                  <Text fontSize='xl' fontStyle={'italic'} marginLeft={'15px'} textColor={useColorModeValue('gray.900', 'gray.100')} >
                    Date of Request
                  </Text>
                  

                  {/* TODO : Align */}
                  <a href={'/ngoDetailForAdmin'}>
                  <Button colorScheme='teal' variant='outline'  >
                    Details
                  </Button>
                  </a>
                </div>
                <Stack spacing={3} align='center' padding={'15px'} >
                  <Button colorScheme='teal' variant='solid' fontSize={'22px'} >
                    Accept
                  </Button>
                  <Button colorScheme='red' variant='solid' fontSize={'22px'} >
                    Reject
                  </Button>
                </Stack>
              </Flex>  
           
           
            </Box>

          </SimpleGrid>  
        </Box>

        {/* --------------------- NGO REQUEST BOX END----------------------------- */}
        

        {/* ---------------------   RECENT TRANSACTION BOX START ----------------------------- */}
        <Box 
        bg={useColorModeValue('gray.300', 'gray.900')}
         w='700px' size='150px'  padding='15px' margin='10px' marginLeft='30px'  >
          
          <Heading marginBottom='15px' >Recent Transactions </Heading>
          
          <SimpleGrid columns={1} spacingX='40px' spacingY='20px'>

            <Box bg={useColorModeValue('white', 'gray.600')} height='80px' borderRadius='15px' >
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
