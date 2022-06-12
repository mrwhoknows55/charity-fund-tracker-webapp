import {
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReportCard(props) {
  const isLoaded = props.isLoaded;
  const [rate, setRate] = useState('1.0');
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
        borderWidth="2px"
        borderRadius="lg"
        w={'45vw'}
        height={'14vh'}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}
      >
        <HStack width={'40vw'} justifyContent={'space-between'} m="1vw">
          <VStack spacing={2} align={'start'} m="1vw">
            <Skeleton isLoaded={isLoaded} maxWidth={'22vw'}>
              <Text
                as="b"
                align={'left'}
                fontSize={{ sm: 'lg', md: 'xl' }}
                noOfLines={2}
              >
                {props.title}
              </Text>
            </Skeleton>
            <SkeletonText noOfLines={1} isLoaded={isLoaded}>
              <Text as="i" fontSize="sm">
                {props.date}
              </Text>
            </SkeletonText>
          </VStack>
          <SkeletonText
            noOfLines={1}
            isLoaded={isLoaded && isCurrencyRateLoaded}
            m="2"
            maxW={'15vw'}
          >
            <Text as="b" padding={10} fontSize="2xl">
              ETH {props.value} <br />
            </Text>
            <Text as="b" padding={10} fontSize="lg">
              ≈ ₹ {Math.floor(parseFloat(props.value) * parseFloat(rate))}
            </Text>
          </SkeletonText>
        </HStack>
      </Stack>
    </>
  );
}
