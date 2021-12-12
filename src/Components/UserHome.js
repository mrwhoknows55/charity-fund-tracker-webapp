import React, { useState, useEffect } from 'react';
import {
  VStack, Heading, Box, Text,Center,Stack,Image,Button,
  SimpleGrid
} from '@chakra-ui/react';
import axios from "axios";


const IMAGE1 =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHYc1L-5gY5vASNBQMBquJzPaTfPuDHHU4pLPiBcLQuA4Jb4vc-K5_N4Gv9Dl7vSZPqlc&usqp=CAU';
export default function ProductSimple() {

    const [charities, setCharities] = useState([]);

    useEffect(()=> {
        axios.get('https://fundtracking.herokuapp.com/charity')
        .then((response)=> {
            if(response.data.status) {
                setCharities(response.data.charities);
                console.log(response.data.charities)
            }
        })
        .catch((err) => {
            alert("Something went wrong");
            console.log('Error: '+err.message);
        });
    }, []);

  return (
    <VStack spacing={8}>
        
       
        <h1>NGO List</h1> 
        <Center py={12} marginTop={90}>
        
        
        <SimpleGrid columns={4} spacing={10}>

            {
                charities.map((charity) =>
                    <React.Fragment key={charity.charity_id}>
                        <Box role={'group'} p={6} maxW={'20vw'} w={'full'}
                            boxShadow={'2xl'} rounded={'lg'} pos={'relative'} zIndex={-1}>
                            <Box
                            rounded={'lg'}
                            mt={-12}
                            pos={'relative'}
                            height={'230px'}
                            _after={{
                                transition: 'all .3s ease',
                                content: '""',
                                w: 'full',
                                h: 'full',
                                pos: 'absolute',
                                top: 5,
                                left: 0,
                                backgroundImage: `url(${IMAGE1})`,
                                filter: 'blur(15px)',
                                zIndex: -1,
                            }}
                            _groupHover={{
                                _after: {
                                filter: 'blur(20px)',
                                },
                            }}>
                            <Image
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop="auto"
                                marginBottom="auto"
                                rounded={'lg'}
                                height={230}
                                width={282}
                                objectFit={'cover'}
                                src={IMAGE1}
                            />
                            </Box>
                            <Stack pt={10} align={'center'}>
                            <Heading as='h1' fontSize={'2xl'} fontFamily={['body', 'Lucida Bright']} fontWeight={700}>
                            {charity.name}
                            </Heading>
                            <p align="start">This NGO is working since 2000. In this 20 years we taking many activities for needy people and also we donated money to desaster management commities</p>
                            <br/>
                            <Stack direction={'row'} align={'center'}>
                                <Text fontWeight={800} fontSize={'xl'}>
                                Funds : 
                                </Text>
                                <Text color={'gray.600'}>
                                ${charity.total_fundings}
                                </Text>
                            </Stack>
                            <Stack direction={'row'} align={'center'}>
                                <Text fontWeight={800} fontSize={'xl'}>
                                Expenditure : 
                                </Text>
                                <Text color={'gray.600'}>
                                ${charity.total_expenditure}
                                </Text>
                            </Stack>
                            <Button>
                                More information
                            </Button>
                            </Stack>


                        </Box>
                    </React.Fragment>
                )

            
        }
            </SimpleGrid>
        </Center>





        
    </VStack>  
  );
}
