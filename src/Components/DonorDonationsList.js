import React, { PureComponent } from 'react';
import {
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json';
import DonorDonationCard from './DonorDonationCard';
import { API_URL } from '../Constants';

class DonorDonationsList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      profileImg: 'https://avatars.dicebear.com/api/male/username.svg',
      donationList: [],
      fundEthContract: '',
      smartContractLoaded: false,
      areDonationLoaded: false,
      isProfileLoaded: false,
    };

    this.access_token = window.sessionStorage.getItem('access_token');
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
    this.getAllDonations = this.getAllDonations.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(`${API_URL}/user/profile`, {
        headers: { Authorization: 'Bearer ' + this.access_token },
      })
      .then(response => {
        if (response.data.status) {
          console.log(response.data);
          this.setState({
            profileImg: response.data.user.profile_image,
            isProfileLoaded: true
          });
          // this.state.isProfileLoaded = true;
        }
      })
      .catch(err => {
        console.error(err);
        this.state.isProfileLoaded = true;
      });

    await this.loadWeb3();
    await this.loadSmartConrtact();
    await this.getAllDonations();

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

  async getAllDonations() {
        axios.get(`${API_URL}/doner/donations`, {
            headers: { Authorization: 'Bearer ' + this.access_token },
        }).then(res => {
            console.log(res)
            this.setState({
                donationList: res.data.donations,
                areDonationLoaded: true,
            });
        }).catch(err => {
            console.log(err);
            console.log(err.message);
            this.state.areDonationLoaded = true;
        });
    }

  render() {
    console.log(this.state.donationList);
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
              <Stack width={'90vw'} height={'1vh'} direction={{ base: 'column', md: 'row' }} padding={4} >
                <HStack width={'80vw'} justifyContent={'space-between'}>
                    <Text as="b" padding={10} fontSize="2xl">
                        Charity
                    </Text>
                    <Heading fontSize={'2xl'}>
                        Donation Time
                    </Heading>
                    <Heading fontSize={'2xl'}>
                        Donation Amount
                    </Heading>
                </HStack>
            </Stack>
            {
                !this.state.areDonationLoaded?
                <DonorDonationCard
                    isLoaded={false} donor="abc" charity="xyz" charityId={1}
                    date={new Date("1658151170" * 1000).toLocaleDateString()+' '+new Date("1658151170" * 1000).toLocaleTimeString()}
                    value="1"
                />:
                this.state.donationList.length === 0?
                <Stack borderWidth="1px" borderRadius="lg" width={'90vw'} height={'12vh'} direction={{ base: 'column', md: 'row' }} boxShadow={'2xl'} padding={4} >
                    <HStack width={'80vw'} justifyContent={'space-evenly'}>
                        <Heading fontSize={'2xl'}>
                            You have not made any donations yet!
                        </Heading>
                    </HStack>
                </Stack>:null
            }


              {this.state.donationList.map((donation, index) => (
                <React.Fragment key={index}>
                  <DonorDonationCard
                    isLoaded={this.state.areDonationLoaded}
                    donation_id={donation.donation_id}
                    donor={donation.doner}
                    charity={donation.charity}
                    charityId={donation.charityId}
                    date={
                      new Date(donation.date * 1000).toLocaleDateString() + ' ' +
                      new Date(donation.date * 1000).toLocaleTimeString()
                      
                    }
                    value={window.web3.utils.fromWei(
                      donation.eth_in_wei,
                      'ether'
                    )}
                  />
                </React.Fragment>
              ))}
            </VStack>
          </HStack>
        </Center>
      </>
    );
  }
}

export default DonorDonationsList;
