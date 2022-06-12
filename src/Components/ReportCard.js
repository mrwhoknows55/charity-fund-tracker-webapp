import {
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function ReportCard(props) {
  // const [reason, setReason] = useState("...");
  
  // async function getReason() {
  //   await props.getReason(props.blockHash).then(r => {setReason(r); console.log(reason)})

  // }

  // useEffect(async () => {
  //   await getReason();
  // })

  return (
    <>
      <Stack onClick={() => {props.onclick_add(props.blockHash)}}
        borderWidth='1px'
        borderRadius='lg'
        w={{ sm: '100%', md: '50rem' }}
        height={{ sm: '476px', md: '8rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        padding={4}>
        <HStack width={'40vw'} justifyContent={'space-between'}>
          <VStack spacing={2} align={'start'} padding={10}>
            <Text as='b' fontSize='xl' title={props.title}>
              { props.title.substr(0,18) }...{props.title.substr(props.title.length-4, props.title.length)}
              {/* { reason } */}
            </Text>
            <Text as='i' fontSize='sm'>
              { props.date }
            </Text>
          </VStack>
          <Text as='b' fontSize='2xl' align='left'  padding={10}>
            { props.value } ETH
          </Text>
        </HStack>
      </Stack>
    </>
  );
}
