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
          charityWalletAddress: '',
          expenses: [],
          donations: [],
          donationList: [],
          fundEthContract: '',
          account: '',
          smartContractLoaded: false,
        }

        this.access_token = window.sessionStorage.getItem('access_token');
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.loadWallet = this.loadWallet.bind(this);
        this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
        this.getAllDonations = this.getAllDonations.bind(this);

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
                    charityWalletAddress: response.data.user.meta_wallet_address
                })
            }
        })
        .catch((err) => {
            console.error(err);
        });

        await  axios.get('https://fundtracking.herokuapp.com/charity/profile/expenses', { headers: { 'Authorization': 'Bearer ' + this.access_token } })
        .then((response) => {
            console.log(response.data);
            if (response.data.status) {
            this.setState({
                expenses: response.data.expenses
            });
            console.log(response.data.expenses);
            }
        })
        .catch((err) => {
            alert('Something went wrong');
            console.log('Error: ' + err.message);
        });

        await axios.get('https://fundtracking.herokuapp.com/charity/profile/donations', { headers: { 'Authorization': 'Bearer ' + this.access_token } })
        .then((response) => {
            console.log(response.data);
            if (response.data.status) {
                this.setState({
                    donations: response.data.donations
                });
                console.log(response.data.donations);
            }
        })
        .catch((err) => {
            alert('Something went wrong');
            console.log('Error: ' + err.message);
        });

      await this.loadWeb3();
      await this.loadWallet();
      await this.loadSmartConrtact();
      await this.getAllDonations();

      this.loadWallet = this.loadWallet.bind(this);
      this.loadWeb3 = this.loadWeb3.bind(this);
      this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
      this.getAllDonations = this.getAllDonations.bind(this);

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
                smartContractLoaded: true
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
                        <Button colorScheme={'teal'} size={'md'}>
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
                        avatarUrl={"https://www.logo-company.in/logo/best-logo-designer-company-389.jpg"}
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
                    this.state.expenses.map((expense) =>
                    <React.Fragment key={expense.expense_id}>

                        <ReportCard
                        title={expense.reason}
                        date={expense.date}
                        value={expense.amount}
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