import { Avatar, Center, Heading, HStack, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DonationCard(props) {
  const [rate, setRate] = useState("1.0");

  useEffect(() => {
    donateEth();
  });

  async function donateEth() {
    const apiLink = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR`;
    console.log('LINK: ' + apiLink);
    await axios
      .get(apiLink)
      .then(response => {
        console.log('response: ' + JSON.stringify(response));

        if (response.data.INR) {
          console.log(response.data.INR);
          const mult = response.data.INR;
          setRate(mult.toString());
        } else {
          setRate("1");
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  return (
    <>
      <Stack
        borderWidth='1px'
        borderRadius='lg'
        w={{ sm: '100%', md: '50rem' }}
        height={{ sm: '476px', md: '10rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}>
        <Center>
          <Avatar
            size={'2xl'}
            src={props.avatarUrl}
            alt={'Avatar Alt'}
            pos={'relative'}
          />
        </Center>
        <HStack width={'40vw'} justifyContent={'space-between'}>
          <VStack spacing={2} padding={10} alignItems={'flex-start'}>
            <Heading fontSize={'2xl'}>
              {props.name}
            </Heading>
            <Text as='i' fontSize='sm'>
              {props.date}
            </Text>
          </VStack>
          <Text as='b' padding={10} fontSize='2xl'>
              ETH {props.value} <br/>
            <Text as='b' padding={10} fontSize='  2xl'>
            ≈ ₹ {Math.floor(parseFloat(props.value)*parseFloat(rate))}
            </Text>
          </Text>
        </HStack>
      </Stack>
    </>
  );
}
