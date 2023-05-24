import React, { PureComponent } from 'react';
import {
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  useColorModeValue,
  SkeletonText,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json';
import DonorDonationCard from './DonorDonationCard';
import NoDonationModal from './NoDonationModal';
import { Link } from 'react-router-dom';
import { API_URL } from '../Constants';

class DonationDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id+'',
      donation: {charity: '', doner: ''},
      fundEthContract: '',
      smartContractLoaded: false,
      isDonationLoaded: false,
      isCurrencyRateLoaded: false,
      rate: '1.0'
    };
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
    this.getDonationsById = this.getDonationsById.bind(this);
    this.getConversionRate = this.getConversionRate.bind(this);
    this.openCharityPage = this.openCharityPage.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadSmartConrtact();
    await this.getDonationsById();
    await this.getConversionRate();
  }

  async loadWeb3() {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log('User meta mask connection successful !');
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
        console.log('User meta mask connection request rejected!');
      } else {
        console.log(e.message);
      }
    }
  }

  async loadSmartConrtact(e) {
    let web3 = await window.web3;
    const networkId = await web3.eth.net.getId();
    const fundEthData = fundEth.networks[networkId];
    if (fundEthData) {
      const fundEth_Contract = new web3.eth.Contract(
        fundEth.abi,
        fundEthData.address
      );
      this.setState({
        fundEthContract: fundEth_Contract,
        smartContractLoaded: true,
      });
    } else {
      window.alert('fundEth contract not deployed to detected network.');
    }
  }

  async getDonationsById() {
    await axios.get(`${API_URL}/donations/details/`+this.state.id+``)
    .then(res => {
        console.log(res);
        this.setState({
            donation: res.data.donation,
            isDonationLoaded: true,
        });
    }).catch(err => {
        console.log(err);
        console.log(err.message);
        this.setState({
            isDonationLoaded: true
        })
    });
  }

  async getConversionRate() {
    const apiLink = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR`;
    await axios
      .get(apiLink)
      .then(response => {
        if (response.data.INR) {
          const mult = response.data.INR;
          this.setState({rate: mult.toString()});
        } else {
            this.setState({rate: '1'});
        }
        this.setState({isCurrencyRateLoaded: true});
    })
    .catch(err => {
        console.error(err);
        this.setState({isCurrencyRateLoaded: true});
      });
  }

  async openCharityPage() {
    await axios.get(`${API_URL}/charity/id/'+this.state.donation.charityId`)
    .then(res => {
        if(res.data.status) {
            window.location.href = '/charity/'+res.data.charity.username;
        }else{
            return '/';
        }
    })
  }

  render() {
    console.log(this.state.donation);
    return (
      <>
        <Center>
          <HStack
            spacing={8}
            align={'start'}
            width={'100vw'}
            overflowY={'hidden'}
          >
            <VStack
              spacing={8}
              m={'5vw'}
              alignItems={'flex-start'}
              width={'90vw'}
            >
            <Stack 
                borderWidth="1px"
                borderRadius="lg"
                width={'90vw'}
                height={'75vh'}
                direction={{ base: 'column', md: 'row' }}
                boxShadow={'2xl'}
                padding={4}
                >
            {
                this.state.isDonationLoaded?
                <VStack>
                    <Stack className="scrolling-component" overflow={'scroll'}>
                        <HStack width={'80vw'} justifyContent={'space-evenly'}>
                            <SkeletonText noOfLines={3} paddingTop={10} isLoaded={this.state.isCurrencyRateLoaded}>
                                <Text  paddingRight={2} display={'inline-block'} fontSize="md">Donation Made By &nbsp; </Text>
                                <Heading display={'inline-block'} >{this.state.donation.doner}</Heading>
                            </SkeletonText>
                        </HStack>
                        <HStack width={'80vw'} paddingBottom={10} justifyContent={'space-evenly'}>
                            <SkeletonText noOfLines={3} isLoaded={this.state.isCurrencyRateLoaded}>
                                <Text  paddingRight={2} display={'inline-block'} fontSize="md" title={this.state.donation.from_address} cursor={'pointer'} >{this.state.donation.from_address}</Text>
                            </SkeletonText>
                        </HStack>
                        <HStack width={'80vw'} padding={10} paddingY={8} justifyContent={'space-between'}>
                            <Text fontSize={'2xl'} as="b">Donation Information:</Text>
                        </HStack>
                        <HStack width={'80vw'} justifyContent={'space-between'}>
                            <SkeletonText noOfLines={3} padding={10} paddingY={1} isLoaded={this.state.isCurrencyRateLoaded}>
                                <Text as="b" padding={10} paddingY={0} paddingRight={1} fontSize="xl">Charity Name: </Text>
                                <Text cursor={'pointer'} onClick={this.openCharityPage} as="a" padding={10} paddingY={0} paddingLeft={1} fontSize="xl">{this.state.donation.charity}</Text>
                            </SkeletonText>
                        </HStack>
                        <HStack width={'80vw'} justifyContent={'space-between'}>
                            <SkeletonText noOfLines={3} padding={10} paddingY={1} isLoaded={this.state.isCurrencyRateLoaded}>
                                <Text as="b" padding={10} paddingY={0} paddingRight={1} fontSize="xl">Donated To (wallet address): </Text>
                                <Text as="a" padding={10} paddingY={0} paddingLeft={1} fontSize="xl" title={this.state.donation.to_address} cursor={'pointer'} >{this.state.donation.to_address}</Text>
                            </SkeletonText>
                        </HStack>
                        <HStack width={'80vw'} justifyContent={'space-between'}>
                            <Skeleton padding={10} paddingY={1} isLoaded={this.state.isCurrencyRateLoaded}>
                                <Text as="b" padding={10} paddingY={0} paddingRight={1} fontSize="xl">Time: </Text>
                                <Text as="a" padding={10} paddingY={0} paddingLeft={1} fontSize="xl">
                                    {new Date(this.state.donation.date * 1000).toLocaleDateString()}  {new Date(this.state.donation.date * 1000).toLocaleTimeString()}    
                                </Text>
                            </Skeleton>
                        </HStack>
                        <HStack width={'80vw'} justifyContent={'space-between'}>
                            <Skeleton padding={10} paddingY={1} isLoaded={this.state.isCurrencyRateLoaded}>
                                <Text as="b" padding={10} paddingY={0} paddingRight={1} fontSize="xl">Amount: </Text>
                                <Text as="a" padding={10} paddingY={0} paddingLeft={1} fontSize="xl">
                                ETH {Web3.utils.fromWei(this.state.donation.eth_in_wei, 'ether')} (≈ ₹ {Math.floor(parseFloat(Web3.utils.fromWei(this.state.donation.eth_in_wei, 'ether')) * parseFloat(this.state.rate))})
                                </Text>
                            </Skeleton>
                        </HStack>
                    </Stack>
                </VStack>
            :null
            }
            {
                !this.state.donation.donated && this.state.isDonationLoaded?
                <NoDonationModal/>
                :null
            }
        </Stack>    
            </VStack>
          </HStack>
        </Center>
      </>
    );
  }
}

export default DonationDetail;
