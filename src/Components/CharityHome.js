import { Avatar, Button, Center, Heading, HStack, VStack } from '@chakra-ui/react';
import DonationCard from './DonationCard';
import ReportCard from './ReportCard';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json'

function CharityHome() {

  const [profileImg, setProfileImg] = useState('https://avatars.dicebear.com/api/male/username.svg');
  const [charityName, setCharityName] = useState('Charity Name');
  const [charityWalletAddress, setCharityWalletAddress] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationList, setdonationList] = useState([]);
  const [fundEthContract, setFundEthContract] = useState("");
  const [account, setAccount] = useState("");
  const [smartContractLoaded, setSmartContractLoaded] = useState(false);
  const access_token = window.sessionStorage.getItem('access_token');

  useEffect(() => {

    axios.get('https://fundtracking.herokuapp.com/user/profile', {
        headers: { Authorization: 'Bearer ' + access_token },
    })
      .then(response => {
          if (response.data.status) {
              console.log(response.data);
              setProfileImg(response.data.user.profile_image);
              setCharityName(response.data.user.name);
              setCharityWalletAddress(response.data.user.meta_wallet_address);
          }
      })
      .catch((err) => {
        console.error(err);
      });

    axios.get('https://fundtracking.herokuapp.com/charity/profile/expenses', { headers: { 'Authorization': 'Bearer ' + access_token } })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setExpenses(response.data.expenses);
          console.log(response.data.expenses);
        }
      })
      .catch((err) => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
      });

    axios.get('https://fundtracking.herokuapp.com/charity/profile/donations', { headers: { 'Authorization': 'Bearer ' + access_token } })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setDonations(response.data.donations);
          console.log(response.data.donations);
        }
      })
      .catch((err) => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
      });

      loadWeb3();
      loadWallet();
      loadSmartConrtact();
      getAllDonations();
      getAllExpenses();
  
}, []);


async function loadWeb3() {
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

  async function loadWallet() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  async function loadSmartConrtact(e) {
    let web3 = await window.web3
    const networkId = await web3.eth.net.getId()
    const fundEthData = fundEth.networks[networkId]
    if(fundEthData) {
        const fundEth_Contract = new web3.eth.Contract(fundEth.abi, fundEthData.address);
        setFundEthContract(fundEth_Contract);
        setSmartContractLoaded(true);
    } else {
        window.alert('fundEth contract not deployed to detected network.')
    }
  }

  async function getAllDonations() {
  if(smartContractLoaded) {
    fundEthContract.methods
    .getDonationsOf(charityWalletAddress)
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
          setdonationList(n);
      }).catch(err => {
          console.log(err)
          console.log(err.message);
    })
  }else{
    alert("smart contract not loaded!")
  }
  }

  async function getAllExpenses() {
    console.log('first')
      await getAccountTransactions()
  }

  async function getAccountTransactions(accAddress) {
    // You can do a NULL check for the start/end blockNumber
    let web3 = window.web3
    let endBlockNumber = 0

    await web3.eth.getBlockNumber().then(res => {
      if(res)
        endBlockNumber = res;
    })
  
    console.log("Searching for transactions to/from account \"" + accAddress + "\" within blocks "  + 0 + " and " + endBlockNumber);
  
    for (var i = 0; i <= endBlockNumber; i++) {
      var block = web3.eth.getBlock(i, true)
      block.then(resBlock => {
        if(i<10)
          console.log(resBlock)

          let  t_expenses = []
          if (resBlock != null && resBlock.transactions != null) {
            resBlock.transactions.forEach( function(e) {
              let t_transaction = {
                nonce: e.nonce,
                blockHash: e.blockHash,
                blockNumber: e.blockNumber,
                transactionIndex: e.transactionIndex,
                from: e.from,
                to: e.to,
                value: window.web3.utils.fromWei( e.value , 'ether') + "ETH",
                gasPrice: e.gasPrice,
                gas: e.gas,
                timestamp: new Date(e.timestamp*1000).toLocaleString()
              };
              if (accAddress == "*" || accAddress == e.from || accAddress == e.to) {
                  console.log("  tx hash          : " + e.hash + "\n"
                  + "   nonce           : " + e.nonce + "\n"
                  + "   blockHash       : " + e.blockHash + "\n"
                  + "   blockNumber     : " + e.blockNumber + "\n"
                  + "   transactionIndex: " + e.transactionIndex + "\n"
                  + "   from            : " + e.from + "\n" 
                  + "   to              : " + e.to + "\n"
                  + "   value           : " + window.web3.utils.fromWei( e.value , 'ether') + "ETH \n"
                  + "   gasPrice        : " + e.gasPrice + "\n"
                  + "   gas             : " + e.gas + "\n");
              }
            })
          }
      })
    }
  }

  return (
    <>
      <Center>
        <HStack spacing={8} align={'start'}>
          <VStack spacing={8} marginTop={90} alignItems={'flex-start'}>
            <HStack spacing={2}>
              <Avatar
                size={'2xl'}
                src={profileImg}
                alt={'Avatar Alt'}
                pos={'relative'}
              />
              <VStack align={'start'} padding={10}>
                <Heading>
                  {charityName}
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
              // donations.map((donation) =>
              // <React.Fragment key={donation.donation_id}>

              //   <DonationCard
              //     avatarUrl={donation.user_profile_image}
              //     name={donation.user_name}
              //     date={donation.date}
              //     value={donation.amount}
              //     />,
              // newline
              //   </React.Fragment>
              // )
              donationList.map((donation, index) =>
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
              expenses.map((expense) =>
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
  );
}

export default CharityHome;
