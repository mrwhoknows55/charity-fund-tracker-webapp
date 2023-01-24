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
import { API_URL } from '../Constants';

class CharityHome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      profileImg: 'https://avatars.dicebear.com/api/male/username.svg',
      charityName: 'Charity Demo',
      charityId: 0,
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
    this.getExpenseReason = this.getExpenseReason.bind(this);
    this.add_exp = this.add_exp.bind(this);
    this.update_exp = this.update_exp.bind(this);
    this.getAllExp = this.getAllExp.bind(this);
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
            charityName: response.data.user.name,
            charityWalletAddress: response.data.user.meta_wallet_address,
            charityId: response.data.user.user_id,
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
    await this.loadWallet();
    await this.loadSmartConrtact();
    await this.getAllDonations();
    await this.getAccountTransactions(this.state.charityWalletAddress);

  }

  async getAccountTransactions(accAddress) {
    // You can do a NULL check for the start/end blockNumber
    let web3 = window.web3;
    let endBlockNumber = 0;
    let { contractAddress } = this.state;
    console.log(contractAddress);

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
              e.to !== contractAddress &&
              e.to !== '0x2c7A9696a85593e442f9BeFB99DDd8C8C98EC499' &&
              amountInEth > 0
            ) {
              let t_transaction = {
                reason: '[Reason Not Submitted]',
                nonce: e.nonce,
                blockHash: e.blockHash,
                blockNumber: e.blockNumber,
                transactionIndex: e.transactionIndex,
                from: e.from,
                to: e.to,
                value: amountInEth,
                gasPrice: e.gasPrice,
                gas: e.gas,
                date: new Date(resBlock.timestamp*1000).toLocaleString(),
                timestamp: resBlock.timestamp,
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
    }, ()=>{
      console.log(web3.eth.getBalance(this.state.account))
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

  async getExpenseReason(blockHash) {
    if(this.state.smartContractLoaded) {
        let reason = '';
        await this.state.fundEthContract.methods
        .getExpenseByHash(blockHash)
        .call()
        .then(res => {
            console.log(res);
            reason = res.reason;
        }).catch(err => {
            console.log(err)
            console.log(err.message);
            reason = 'No Reason Found!'
        })
        return reason;
    }else{
        alert("smart contract not loaded!")
        return 'else-res'
    }
}

async add_exp(blockHash, reason) {
    let account = this.state.account;
    console.log(account);
    if(this.state.smartContractLoaded) {
        this.state.fundEthContract.methods
        .createExpense(
            blockHash.toString(),
            reason,
            account
        )
        .send({
          from: account,
          value: 50000000000000,
          gas: 504405,
          gasPrice: 9913,
        })
        .then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err)
            console.log(err.message);
        })
    }else{
        alert("smart contract not loaded!")
    }
}
async update_exp(blockHash, reason) {
  let account = this.state.account;
  console.log(account);
    if(this.state.smartContractLoaded) {
        this.state.fundEthContract.methods
        .updateExpense(
            blockHash.toString(),
            reason,
            account
        )
        .send({
          from: account,
          value: 50000000000000,
          gas: 504405,
          gasPrice: 9913,
        })
        .then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err)
            console.log(err.message);
        })
    }else{
        alert("smart contract not loaded!")
    }
}

async getAllExp() {
    if(this.state.smartContractLoaded) {
        this.state.fundEthContract.methods
        .getExpensesOf(
            '0x812351DC2369256E27DEFb0bF1568d782053eD65'
        )
        .call()
        .then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err)
            console.log(err.message);
        })
    }else{
        alert("smart contract not loaded!")
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
                    <Button colorScheme={'teal'} size={'md'} m={'1vh'} onClick={this.getAllExp}>
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
                    donation_id={donation.donation_id}
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
              {/* <HStack spacing={8}> */}
                <Heading alignSelf={'start'}  paddingTop={'5'}>
                  Expenses
                </Heading>
                {/* <HStack justifyContent={'end'} width={'25vw'}>
                  <Button colorScheme={'teal'} size={'lg'}>
                    Add Expense
                  </Button>
                  <Button colorScheme={'teal'} size={'lg'}>
                    Add Report
                  </Button>
                </HStack> */}
              {/* </HStack> */}
              {this.state.expenses.map((expense, index) => (
                <React.Fragment key={index}>
                  <ReportCard
                    blockHash={expense.blockHash}
                    expense={expense}
                    isLoaded={this.state.areExpensesLoaded}
                    title={expense.reason}
                    getReason={this.getExpenseReason}
                    date={expense.date}
                    value={expense.value}
                    onclick_add={this.add_exp}
                    onclick_update={this.update_exp}
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
