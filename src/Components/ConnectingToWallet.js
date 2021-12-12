import { Spinner, Text, VStack } from '@chakra-ui/react';

const ConnectingToWallet = () => {
  return (<>
    <VStack width={'100vw'} position={'absolute'} top={'40vh'}>
      <Spinner
        thickness='2px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='lg'
      />
      <Text as={'h1'}>
        Connecting To Metamask Wallet
      </Text>
    </VStack>
  </>);
};

export default ConnectingToWallet;