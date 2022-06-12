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
  const clickable = props.view !== 'doner';
  const isLoaded = props.isLoaded;
  const [rate, setRate] = useState('1.0');
  const [reason, setReason] = useState(props.title);
  const [hasReason, setHasReason] = useState(false);
  const [isCurrencyRateLoaded, setCurrencyRateLoaded] = useState(false);

  useEffect(() => {
    async function getCharityExpenseReason() {
      props.getReason(props.blockHash)
      .then(res => {
        console.log(res)
        if(res){
          setReason(res);
          setHasReason(true);
        }
      }).catch(err => {
        console.log(err);
      })
    }

    getConversionRate();
    if(isLoaded)
      getCharityExpenseReason();
  }, [isLoaded]);

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

  async function addReasonToExpense() {
    let res = prompt("previous reason: "+reason+"\nAdd new reason: ");
    if(!res)
      return -1;
    let confirm = window.confirm("add below reason to selected expense?\n"+res);
    if (confirm) {
      if(hasReason)
        props.onclick_update(props.blockHash, res)
      else
        props.onclick_add(props.blockHash, res)
    }
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
        onClick={(clickable)?addReasonToExpense:null}
        cursor={'pointer'}
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
                {reason}
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
