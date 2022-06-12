import {
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
  InputGroup,
  Input,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportCard from './ReportCard';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json';
import Select from 'react-select';

const expenses = [
  {
    title: 'RO Purifying machine',
    date: '23-04-2021',
    value: '7,80,000',
  },
  {
    title: 'Books for school students',
    date: '13-02-2021',
    value: '10,80,000',
  },
  {
    title: 'New sports equipments on playgrounds',
    date: '2-11-2020',
    value: '4,80,000',
  },
];

function CharityDetails() {
  const { username } = useParams();
  const [charity, setCharity] = useState({});
  const [user, setUser] = useState({});
  const [fundEthContract, setFundEthContract] = useState(null);
  const [account, setAccount] = useState('');
  const [smartContractLoaded, setSmartContractLoaded] = useState(false);
  const [ethAmount, setEthAmount] = useState('');
  const [isLoading, setLoading] = useState(true);
  const access_token = window.sessionStorage.getItem('access_token');

  const [selectedCurrency, setSelectedCurrency] = useState({
    label: 'Indian Rupee',
    symbol: 'Rs',
    symbolNative: '₹',
    decimalDigits: 2,
    rounding: 0,
    value: 'INR',
    labelPlural: 'Indian rupees',
  });
  const handleCurrencySelection = value => {
    console.log('Selected: ' + value);
    setSelectedCurrency(value);
  };
  const currencies = require('../data/currencies.json');

  useEffect(() => {
    loadWeb3();
    loadWallet();
    loadSmartConrtact();
    axios
      .get('https://fundtracking.herokuapp.com/user/profile', {
        headers: { Authorization: 'Bearer ' + access_token },
      })
      .then(response => {
        if (response.data.status) {
          console.log(response.data);
          setUser(response.data.user);
        }
      })
      .catch(err => {
        console.error(err);
      });

    axios
      .get(`https://fundtracking.herokuapp.com/charity/${username}`)
      .then(response => {
        if (response.data.status) {
          console.log(response.data);
          setCharity(response.data.charity);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      })
      .catch(err => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
        setLoading(false);
      });
  }, [access_token, username]);

  async function loadWeb3() {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log('User meta mask connection successful!');
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        console.log('User meta mask connection successful!');
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        );
      }
    } catch (e) {
      if (e.code) {
        console.log('User rejected meta mask connection request!');
      } else {
        console.log(e.message);
      }
    }
  }

  async function loadWallet() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  async function loadSmartConrtact(e) {
    let web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const fundEthData = fundEth.networks[networkId];
    if (fundEthData) {
      const fundEth_Contract = await new web3.eth.Contract(
        fundEth.abi,
        fundEthData.address
      );
      setFundEthContract(fundEth_Contract);
      setSmartContractLoaded(true);
    } else {
      window.alert('fundEth contract not deployed to detected network.');
    }
  }

  async function sendEth(ethAmount) {
    console.log('eth : ' + ethAmount);
    if (smartContractLoaded) {
      try {
        await fundEthContract.methods
          .createDonation(
            charity.meta_wallet_address,
            Math.floor(new Date().getTime() / 1000),
            false,
            user.name,
            user.user_id,
            charity.name,
            charity.user_id
          )
          .send({
            from: account,
            value: Web3.utils.toWei(ethAmount, 'ether'),
          })
          .then(async res => {
            console.log(res);
            console.log('transaction successfull.');
            window.web3.eth.getBalance(account).then(value => {
              //  console.log("account balance: " + window.web3.utils.fromWei( value , 'ether') + " ETH");
              //  alert("transaction successfull (balance: "+window.web3.utils.fromWei( value , 'ether')+")")
            });
          })
          .catch(async err => {
            console.log(err);
            console.log(err.message);
          });
      } catch (error) {
        if (error.name === 'TypeError') {
          alert('Please login to use Donate feature!!!');
          document.location.href = '/login';
        }
      }
    } else {
      alert(
        'SmartContract not loaded successfully, please contact the developer of this website if feel necessary...'
      );
    }
  }

  function viewCertDoc(e) {
    e.preventDefault();
    if (charity.charityDetails && charity.charityDetails.tax_exc_cert) {
      // const fileURI = charity.charityDetails.tax_exc_cert.replace('data:application/pdf;base64,', '');
      window.open(charity.charityDetails.tax_exc_cert, '_blank');
      // pdfWindow.document.write('<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' + encodeURI(fileURI) + '\'></iframe>');
    } else {
      window.alert('Tax Exemption Certificate Not Available');
    }
  }

  async function donateEth() {
    const apiLink = `https://min-api.cryptocompare.com/data/price?fsym=${selectedCurrency.value}&tsyms=ETH`;
    console.log('LINK: ' + apiLink);
    await axios
      .get(apiLink)
      .then(response => {
        console.log('response: ' + JSON.stringify(response));

        if (response.data.ETH) {
          console.log(response.data.ETH);
          const mult = response.data.ETH;
          // eslint-disable-next-line
          const convertedEthValue = eval(ethAmount * mult);
          console.log('convertedEthValue: ' + convertedEthValue);
          sendEth(
            convertedEthValue
              .toString()
              .substr(
                0,
                convertedEthValue.toString().length -
                  (convertedEthValue.toString().length - 20)
              )
          );
        } else {
          sendEth(ethAmount.toString());
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  return (
    <>
      <VStack
        order={'column'}
        overflow={'hidden'}
        spacing={8}
        maxWidth={'100%'}
        width={'100%'}
      >
        <VStack py={'2vh'} marginTop={'2vh'}>
          <Flex
            px={'2vw'}
            w={'100vw'}
            h={'35vh'}
            bg={useColorModeValue('gray.100', 'gray.900')}
          >
            <HStack
              w={'100vw'}
              spacing={'10vw'}
              justifyContent={'space-evenly'}
            >
              <HStack spacing={'2vw'}>
                <SkeletonCircle
                  height={'12vw'}
                  width={'12vw'}
                  isLoaded={!isLoading}
                >
                  <Image
                    w="12vw"
                    src={charity.profile_image}
                    borderRadius="full"
                  />
                </SkeletonCircle>
                <SkeletonText
                  isLoaded={!isLoading}
                  mb={'2vh'}
                  noOfLines={6}
                  spacing="4"
                >
                  <VStack alignItems={'flex-start'}>
                    <Heading mb={'2vh'} fontSize={'46'}>
                      {charity.name}
                    </Heading>
                    <Text>
                      <b>Founded on:</b>{' '}
                      {charity.charityDetails &&
                      charity.charityDetails.founded_in
                        ? charity.charityDetails.founded_in
                        : ''}
                    </Text>
                    <Text>
                      Total Funding: ₹{' '}
                      {charity.charityDetails &&
                      charity.charityDetails.total_fundings
                        ? charity.charityDetails.total_fundings
                        : ``}
                    </Text>
                    <Text>
                      Total expenditure: ₹{' '}
                      {charity.charityDetails &&
                      charity.charityDetails.total_expenditure
                        ? charity.charityDetails.total_expenditure
                        : ``}
                    </Text>
                  </VStack>
                </SkeletonText>
              </HStack>
              <VStack>
                <Skeleton isLoaded={!isLoading}>
                  <Select
                    defaultOptions
                    value={selectedCurrency}
                    options={currencies}
                    onChange={handleCurrencySelection}
                  />
                </Skeleton>
                <Skeleton isLoaded={!isLoading}>
                  <InputGroup>
                    <Input
                      placeholder={
                        'amount in ' +
                        selectedCurrency.symbolNative +
                        ' (eg. 245)'
                      }
                      onChange={e => setEthAmount(e.target.value)}
                    />
                  </InputGroup>
                </Skeleton>
                <Skeleton isLoaded={!isLoading}>
                  <Button
                    colorScheme={'teal'}
                    size={'lg'}
                    onClick={() => donateEth()}
                  >
                    Donate Funds
                  </Button>
                </Skeleton>
              </VStack>

              <VStack
                spacing={'1vw'}
                alignItems={'center'}
                paddingRight={'2vw'}
              >
                <Skeleton isLoaded={!isLoading}>
                  <Button
                    colorScheme={'teal'}
                    size={'lg'}
                    onClick={e => viewCertDoc(e)}
                  >
                    Tax Certificate
                  </Button>
                </Skeleton>
                <Skeleton isLoaded={!isLoading}>
                  <Button colorScheme={'teal'} size={'lg'}>
                    Expense Report
                  </Button>
                </Skeleton>
              </VStack>
            </HStack>
          </Flex>
          <HStack>
            <VStack
              paddingTop={'2vh'}
              alignSelf={'flex-start'}
              alignItems={'flex-start'}
              width={'50vw'}
              paddingStart={'100px'}
            >
              <Skeleton mt="2vh" mb="2vh" isLoaded={!isLoading}>
                <Heading>Description</Heading>
              </Skeleton>

              <SkeletonText isLoaded={!isLoading} noOfLines={12} spacing="6">
                {charity.description ? (
                  <Text align={'justify'}>{charity.description}</Text>
                ) : (
                  <Text align={'justify'}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Animi aperiam enim quo recusandae vero! Culpa hic impedit
                    maxime quaerat voluptate. Debitis dolores fugiat harum
                    laboriosam libero modi provident? Aliquam amet at autem
                    corporis culpa cumque, dolore ea eius enim ex fugiat illo
                    impedit in libero maiores minus nobis officia pariatur
                    perferendis possimus qui quibusdam quisquam quos ratione rem
                    repellat rerum sequi similique sint soluta tenetur totam vel
                    voluptatem. Atque aut autem blanditiis consectetur cumque
                    debitis delectus deleniti dolore doloribus et eveniet facere
                    id ipsum maiores maxime molestias necessitatibus nisi,
                    nostrum omnis quae qui quidem quisquam recusandae sit soluta
                    sunt voluptas voluptatem! A ducimus eum eveniet id illum
                    nisi saepe veritatis, voluptatum. Ab beatae culpa delectus
                    dicta distinctio dolorem doloribus eaque earum eius enim est
                    eveniet ex facere in, minima mollitia natus obcaecati odio
                    odit officia optio perspiciatis quasi quidem sunt
                    voluptates? A ad aliquam autem cupiditate debitis doloremque
                    dolores, fugit ipsa labore optio perspiciatis reiciendis
                    sunt voluptates? Aliquam eligendi eos error hic in non
                    repudiandae saepe temporibus voluptatum. Ab animi autem eos
                    nihil perspiciatis quae quibusdam repellendus rerum? Culpa,
                    cum delectus dolorem doloribus eligendi facere fugit
                    incidunt laborum odio perspiciatis placeat porro quas quasi
                    quibusdam repudiandae unde, voluptates? Accusamus,
                    distinctio?
                  </Text>
                )}
              </SkeletonText>
            </VStack>
            <VStack spacing={8} px={12} marginTop={90}>
              <Skeleton
                alignSelf={'start'}
                paddingTop={'5'}
                w={'20vw'}
                mt="2vh"
                h={'7vh'}
                isLoaded={!isLoading}
              >
                <Heading alignSelf={'start'} paddingTop={'5'}>
                  Latest Expenses
                </Heading>
              </Skeleton>
              {expenses.map(expense => (
                <ReportCard
                  title={expense.title}
                  date={expense.date}
                  value={expense.value}
                  isLoaded={!isLoading}
                />
              ))}
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </>
  );
}

export default CharityDetails;
