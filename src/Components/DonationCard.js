import {
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DonationCard(props) {
  const [rate, setRate] = useState('1.0');
  const isLoaded = props.isLoaded;
  const [isCurrencyRateLoaded, setCurrencyRateLoaded] = useState(false);

  useEffect(() => {
    getConversionRate();
  }, []);

  async function getConversionRate() {
    const apiLink = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR`;
    await axios
      .get(apiLink)
      .then(response => {
        if (response.data.INR) {
          const mult = response.data.INR;
          setRate(mult.toString());
        } else {
          setRate('1');
        }
        setCurrencyRateLoaded(true);
      })
      .catch(err => {
        console.error(err);
        setCurrencyRateLoaded(true);
      });
  }
  return (
    <>
      <Stack
        onClick={()=>{window.location.href='/donations/'+props.donation_id}}
        cursor={'pointer'}
        borderWidth="1px"
        borderRadius="lg"
        width={'40vw'}
        height={'12vh'}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}
      >
        <HStack width={'40vw'} justifyContent={'space-between'}>
          <VStack spacing={2} padding={10} alignItems={'flex-start'}>
            <Skeleton isLoaded={isLoaded && isCurrencyRateLoaded}>
              <Heading fontSize={'2xl'}>{props.name}</Heading>
            </Skeleton>
            <Skeleton isLoaded={isLoaded && isCurrencyRateLoaded}>
              <Text as="i" fontSize="sm">
                {props.date}
              </Text>
            </Skeleton>
          </VStack>

          <SkeletonText
            noOfLines={3}
            padding={10}
            isLoaded={isLoaded && isCurrencyRateLoaded}
          >
            <Text as="b" padding={10} fontSize="2xl">
              ETH {parseFloat(props.value).toFixed(6)} <br />
              <Text as="a" padding={10} fontSize="xl">
                (₹ {Math.floor(parseFloat(props.value) * parseFloat(rate))})
              </Text>
            </Text>
          </SkeletonText>
        </HStack>
      </Stack>
    </>
  );
}
