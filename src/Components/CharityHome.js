import React, { PureComponent } from 'react';
import {
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  VStack,
} from '@chakra-ui/react';
import DonationCard from './DonationCard';
import ReportCard from './ReportCard';
import axios from 'axios';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json';

class CharityHome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      profileImg: 'https://avatars.dicebear.com/api/male/username.svg',
      charityName: 'Charity Demo',
      charityWalletAddress: '',
      expenses: require('../data/fakeExpenses.json'),
      donations: require('../data/fakeDonations.json'),
      donationList: [],
      fundEthContract: '',
      contractAddress: '',
      account: '',
      smartContractLoaded: false,
      areDonationLoaded: false,
      areExpensesLoaded: false,
      isProfileLoaded: false,
    };

    this.access_token = window.sessionStorage.getItem('access_token');
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadWallet = this.loadWallet.bind(this);
    this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
    this.getAllDonations = this.getAllDonations.bind(this);
    this.getAccountTransactions = this.getAccountTransactions.bind(this);
  }

  async componentDidMount() {
    await axios
      .get('https://fundtracking.herokuapp.com/user/profile', {
        headers: { Authorization: 'Bearer ' + this.access_token },
      })
      .then(response => {
        if (response.data.status) {
          console.log(response.data);
          this.setState({
            profileImg: response.data.user.profile_image,
            charityName: response.data.user.name,
            charityWalletAddress: response.data.user.meta_wallet_address,
          });
          this.state.isProfileLoaded = true;
        }
      })
      .catch(err => {
        console.error(err);
        this.state.isProfileLoaded = true;
      });

    await this.loadWeb3();
    await this.loadWallet();
    await this.loadSmartConrtact();
    await this.getAllDonations();
    await this.getAccountTransactions(this.state.charityWalletAddress);

    this.loadWallet = this.loadWallet.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
    this.getAllDonations = this.getAllDonations.bind(this);
  }

  async getAccountTransactions(accAddress) {
    // You can do a NULL check for the start/end blockNumber
    let web3 = window.web3;
    let endBlockNumber = 0;
    let { contractAddress } = this.state;

    await web3.eth.getBlockNumber().then(res => {
      if (res) endBlockNumber = res;
    });

    console.log(
      'Searching for transactions to/from account "' +
        accAddress +
        '" within blocks ' +
        0 +
        ' and ' +
        endBlockNumber
    );

    let t_expenses = [];
    for (var i = 0; i <= endBlockNumber; i++) {
      var block = web3.eth.getBlock(i, true);
      await block.then(resBlock => {
        if (resBlock != null && resBlock.transactions != null) {
          resBlock.transactions.forEach(function (e) {
            let amountInEth = parseFloat(
              window.web3.utils.fromWei(e.value, 'ether')
            ).toFixed(4);
            if (
              accAddress === e.from &&
              e.from !== contractAddress &&
              amountInEth > 0
            ) {
              let t_transaction = {
                reason: 'Payment to: ' + e.to,
                nonce: e.nonce,
                blockHash: e.blockHash,
                blockNumber: e.blockNumber,
                transactionIndex: e.transactionIndex,
                from: e.from,
                to: e.to,
                value: amountInEth,
                gasPrice: e.gasPrice,
                gas: e.gas,
                timestamp: new Date(resBlock.timestamp * 1000).toLocaleString(),
              };
              t_expenses.push(t_transaction);
            }
          });
        }
      });
    }
    this.setState(
      {
        expenses: t_expenses.reverse(),
        areExpensesLoaded: true,
      },
      () => {
        console.log(`expenses: ${this.state.expenses}`);
        console.log(JSON.stringify(this.state.expenses));
        this.state.areExpensesLoaded = true;
      }
    );
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

  async loadWallet() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });
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
        contractAddress: fundEthData.address,
      });
    } else {
      window.alert('fundEth contract not deployed to detected network.');
    }
  }

  async getAllDonations() {
    if (this.state.smartContractLoaded) {
      this.state.fundEthContract.methods
        .getDonationsOf(this.state.charityWalletAddress)
        .call()
        .then(res => {
          console.log(res);
          let n = [];
          res.map(value => {
            n.push(value);
            return null;
          });
          n.reverse();
          console.log(`donations ${JSON.stringify(n)}`);
          this.setState({
            donationList: n,
            areDonationLoaded: true,
          });
        })
        .catch(err => {
          console.log(err);
          console.log(err.message);
          this.state.areDonationLoaded = true;
        });
    } else {
      alert('smart contract not loaded!');
    }
  }

  render() {
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
              width={'45vw'}
            >
              <HStack spacing={2}>
                <SkeletonCircle
                  width={'12vw'}
                  height={'12vw'}
                  isLoaded={this.state.isProfileLoaded}
                >
                  <Avatar
                    width={'12vw'}
                    height={'12vw'}
                    src={this.state.profileImg}
                    alt={'Avatar Alt'}
                    pos={'relative'}
                  />
                </SkeletonCircle>
                <VStack align={'start'} padding={10}>
                  <Skeleton isLoaded={this.state.isProfileLoaded}>
                    <Heading>{this.state.charityName}</Heading>
                    <Button colorScheme={'teal'} size={'md'} m={'1vh'}>
                      Edit Profile
                    </Button>
                  </Skeleton>
                </VStack>
              </HStack>
              <Heading alignSelf={'start'} paddingTop={'5'}>
                Latest Donations
              </Heading>
              {this.state.donationList.map((donation, index) => (
                <React.Fragment key={index}>
                  <DonationCard
                    isLoaded={this.state.areDonationLoaded}
                    name={donation.doner}
                    date={
                      new Date(donation.date * 1000).getDay() +
                      '/' +
                      new Date(donation.date * 1000).getMonth() +
                      '/' +
                      new Date(donation.date * 1000).getFullYear()
                    }
                    value={window.web3.utils.fromWei(
                      donation.eth_in_wei,
                      'ether'
                    )}
                  />
                </React.Fragment>
              ))}
            </VStack>
            <VStack spacing={8} py={'10vh'} width={'35vw'}>
              <HStack spacing={8}>
                <Heading alignSelf={'start'}  paddingTop={'5'}>
                  Expenses
                </Heading>
                <HStack justifyContent={'end'} width={'25vw'}>
                  <Button colorScheme={'teal'} size={'lg'}>
                    Add Expense
                  </Button>
                  <Button colorScheme={'teal'} size={'lg'}>
                    Add Report
                  </Button>
                </HStack>
              </HStack>
              {this.state.expenses.map(expense => (
                <React.Fragment key={expense.expense_id}>
                  <ReportCard
                    isLoaded={this.state.areExpensesLoaded}
                    title={expense.reason}
                    date={expense.timestamp}
                    value={expense.value}
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

export default CharityHome;
