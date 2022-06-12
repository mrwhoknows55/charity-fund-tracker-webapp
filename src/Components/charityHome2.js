import React, { PureComponent } from 'react'
import { Avatar, Button, Center, Heading, HStack, VStack } from '@chakra-ui/react';
import DonationCard from './DonationCard';
import ReportCard from './ReportCard';
import axios from 'axios';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json'

class charityHome2 extends PureComponent {

    constructor(props) {
      super(props)
    
      this.state = {
          profileImg: 'https://avatars.dicebear.com/api/male/username.svg',
          charityName: 'Charity Demo',
          charityId: 0,
          charityWalletAddress: '',
          expenses: [],
          donations: [],
          donationList: [],
          fundEthContract: '',
          contractAddress: '',
          account: '',
          smartContractLoaded: false,
        }

        this.access_token = window.sessionStorage.getItem('access_token');
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.loadWallet = this.loadWallet.bind(this);
        this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
        this.getAllDonations = this.getAllDonations.bind(this);
        this.getAccountTransactions = this.getAccountTransactions.bind(this);
        this.getExpenseReason = this.getExpenseReason.bind(this);
        this.add_exp = this.add_exp.bind(this);
        this.getAllExp = this.getAllExp.bind(this);

    }

    async componentDidMount() {

        await axios.get('https://fundtracking.herokuapp.com/user/profile', {
            headers: { Authorization: 'Bearer ' + this.access_token },
        })
        .then(response => {
            if (response.data.status) {
                console.log(response.data);
                this.setState({
                    profileImg: response.data.user.profile_image,
                    charityName: response.data.user.name,
                    charityWalletAddress: response.data.user.meta_wallet_address,
                    charityId: response.data.user.user_id
                })
            }
        })
        .catch((err) => {
            console.error(err);
        });

        await this.loadWeb3();
        await this.loadWallet();
        await this.loadSmartConrtact();
        await this.getAllDonations();
        await this.getAccountTransactions(this.state.charityWalletAddress);
    }

    async getAccountTransactions(accAddress) {
        // You can do a NULL check for the start/end blockNumber
        let web3 = window.web3
        let endBlockNumber = 0
        let {contractAddress} = this.state;
    
        await web3.eth.getBlockNumber().then(res => {
          if(res)
            endBlockNumber = res;
        })
      
        console.log("Searching for transactions to/from account \"" + accAddress + "\" within blocks "  + 0 + " and " + endBlockNumber);
      
        let  t_expenses = []
        for (var i = 0; i <= endBlockNumber; i++) {
          var block = web3.eth.getBlock(i, true)
          await block.then(resBlock => {
            // if(i<10)
            //   console.log(resBlock)
    
              if (resBlock != null && resBlock.transactions != null) {
                resBlock.transactions.forEach( function(e) {
                    if (accAddress === e.from && e.from !== contractAddress && window.web3.utils.fromWei( e.value , 'ether') > 0) {
                        let t_transaction = {
                            reason: 'Payment to: ' + e.to,
                            nonce: e.nonce,
                            blockHash: e.blockHash,
                            blockNumber: e.blockNumber,
                            transactionIndex: e.transactionIndex,
                            from: e.from,
                            to: e.to,
                            value: e.value,
                            gasPrice: e.gasPrice,
                            gas: e.gas,
                            date: new Date(resBlock.timestamp*1000).toLocaleString(),
                            timestamp: resBlock.timestamp,
                        };
                        //   t_expenses.append(t_transaction);
                        // console.log("  tx hash          : " + e.hash + "\n"
                        //     + "   nonce           : " + e.nonce + "\n"
                        //     + "   blockHash       : " + e.blockHash + "\n"
                        //     + "   blockNumber     : " + e.blockNumber + "\n"
                        //     + "   transactionIndex: " + e.transactionIndex + "\n"
                        //     + "   from            : " + e.from + "\n" 
                        //     + "   to              : " + e.to + "\n"
                        //     + "   value           : " + window.web3.utils.fromWei( e.value , 'ether') + "ETH \n"
                        //     + "   gasPrice        : " + e.gasPrice + "\n"
                        //     + "   gas             : " + e.gas + "\n");
                        t_expenses.push(t_transaction);
                    }
                })
              }
            })
        }
        this.setState({
            expenses: t_expenses.reverse()
        }, () => {
            console.log(this.state.expenses)
        })
    }
    
    
    async loadWeb3() {
        try{ 
            if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            console.log("User meta mask connection successful !");
            }else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            console.log("User meta mask connection successful!");
            }else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        }catch(e) {
            if(e.code) {
            console.log("User meta mask connection request rejected!")
            }else{
            console.log(e.message)
            }
        }
    }

    async loadWallet() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({
            account: accounts[0]
        })
    }

    async loadSmartConrtact(e) {
        let web3 = await window.web3
        const networkId = await web3.eth.net.getId()
        const fundEthData = fundEth.networks[networkId]
        if(fundEthData) {
            const fundEth_Contract = new web3.eth.Contract(fundEth.abi, fundEthData.address);
            this.setState({
                fundEthContract: fundEth_Contract,
                smartContractLoaded: true,
                contractAddress: fundEthData.address
            })
        } else {
            window.alert('fundEth contract not deployed to detected network.')
        }
    }

    async getAllDonations() {
    if(this.state.smartContractLoaded) {
        this.state.fundEthContract.methods
        .getDonationsOf(this.state.charityWalletAddress)
        .call()
        .then(res => {
            console.log(res);
            let n = [];
            res.map((value)=> {
                n.push(value)
                return null;
            })
            n.reverse();
            console.log(n)
            this.setState({
                donationList: n
            })
        }).catch(err => {
            console.log(err)
            console.log(err.message);
        })
    }else{
        alert("smart contract not loaded!")
    }
    }

    async getExpenseReason(blockHash) {
        if(this.state.smartContractLoaded) {
            let reason = '1-res';
            await this.state.fundEthContract.methods
            .getExpenseByHash(blockHash)
            .call()
            .then(res => {
                console.log(res + '-' + blockHash);
                reason = 'demo reason'
                return reason;
            }).catch(err => {
                console.log(err)
                console.log(err.message);
                reason = 'err-res'
                return reason;
            })
        }else{
            alert("smart contract not loaded!")
            return 'else-res'
        }
    }

    async add_exp(blockHash) {
        if(this.state.smartContractLoaded) {
            this.state.fundEthContract.methods
            .createExpense(
                blockHash,
                'some random reason 1',
                this.state.charityWalletAddress
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

    async getAllExp() {
        if(this.state.smartContractLoaded) {
            this.state.fundEthContract.methods
            .getExpenseByHash(
                '0x5140e62f3991938b043cf05da4ed8dc767d6474e66c62079ca3400521aec1778'
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
                <HStack spacing={8} align={'start'}>
                <VStack spacing={8} marginTop={90} alignItems={'flex-start'}>
                    <HStack spacing={2}>
                    <Avatar
                        size={'2xl'}
                        src={this.state.profileImg}
                        alt={'Avatar Alt'}
                        pos={'relative'}
                    />
                    <VStack align={'start'} padding={10}>
                        <Heading>
                        {this.state.charityName}
                        </Heading>
                        <Button colorScheme={'teal'} size={'md'} onClick={this.getAllExp}>
                        Edit Profile
                        </Button>
                    </VStack>
                    </HStack>
                    <Heading alignSelf={'start'} paddingTop={'5'}>
                    Latest Donations
                    </Heading>
                    {
                    this.state.donationList.map((donation, index) =>
                    <React.Fragment key={index}>

                        <DonationCard
                        avatarUrl={"https://avatars.dicebear.com/api/male/username.svg"}
                        name={donation.doner}
                        date={(new Date(donation.date*1000)).getDay()+"/"+(new Date(donation.date*1000)).getMonth()+"/"+(new Date(donation.date*1000)).getFullYear()}
                        value={window.web3.utils.fromWei( donation.eth_in_wei , 'ether')}
                        />
                        </React.Fragment>
                    )
                    }
                </VStack>
                <VStack spacing={8} px={12} py={24} marginTop={90}>
                    <HStack spacing={8}>
                    <Heading alignSelf={'start'} paddingTop={'5'}>
                        Latest Expenses
                    </Heading>
                    <HStack justifyContent={'end'} width={'25vw'}>
                        <Button colorScheme={'teal'} size={'lg'}>Add Expense</Button>
                        <Button colorScheme={'teal'} size={'lg'}>Add Report</Button>
                    </HStack>
                    </HStack>
                    {
                    this.state.expenses.map((expense, index) => 
                        <React.Fragment key={index}>
                            <ReportCard
                            blockHash={expense.blockHash}
                            expense={expense}
                            title={expense.reason}
                            getReason={this.getExpenseReason}
                            date={expense.date}
                            value={window.web3.utils.fromWei( expense.value , 'ether')}
                            onclick_add={this.add_exp}
                            />
                        </React.Fragment>
                    )
                    }
                </VStack>
                </HStack>
            </Center>
        </>
        )
    }
}

export default charityHome2