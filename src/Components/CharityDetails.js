import React, { PureComponent } from 'react'
import {
    Button,
    Flex,
    Heading,
    HStack,
    Image,
    Text,
    VStack,
    InputGroup,
    Input,
    Skeleton,
    SkeletonText,
    SkeletonCircle,
    Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import ReportCard from './ReportCard';
import Web3 from 'web3';
import fundEth from '../abi/fundEth.json';
import Select from 'react-select';
import { API_URL } from '../Constants';
const currencies = require('../data/currencies.json');

const temp_expenses = [
    {
        reason: 'RO Purifying machine',
        date: '23-04-2021',
        value: '7,80,000',
    },
];
  
class CharityDetails extends PureComponent {

    constructor(props) {
        super(props)

        let username = window.location.pathname.split('/');
        username = username[username.length-1]
        this.username = username;

        this.state = {
            charity: {},
            user: {},
            fundEthContract: null,
            account: '',
            smartContractLoaded: false,
            contractAddress: '',
            ethAmount: '',
            isLoading: true,
            areExpensesLoaded: false,
            expenses: temp_expenses,
            selectedCurrency: {
                label: 'Indian Rupee',
                symbol: 'Rs',
                symbolNative: '₹',
                decimalDigits: 2,
                rounding: 0,
                value: 'INR',
                labelPlural: 'Indian rupees',
            },
            access_token: window.sessionStorage.getItem('access_token')
        }

        this.handleCurrencySelection = this.handleCurrencySelection.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.loadWallet = this.loadWallet.bind(this);
        this.loadSmartConrtact = this.loadSmartConrtact.bind(this);
        this.getAccountTransactions = this.getAccountTransactions.bind(this);
        this.sendEth = this.sendEth.bind(this);
        this.viewCertDoc = this.viewCertDoc.bind(this);
        this.donateEth = this.donateEth.bind(this);
        this.getExpenseReason = this.getExpenseReason.bind(this);
    }

    handleCurrencySelection = value => {
        console.log('Selected: ' + value);
        this.setState({
          selectedCurrency: value
        })
    };

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadWallet();
        await this.loadSmartConrtact();
        await axios
            .get(`${API_URL}/user/profile`, {
            headers: { Authorization: 'Bearer ' + this.state.access_token },
            })
            .then(response => {
            if (response.data.status) {
                console.log(response.data);
                this.setState({user: response.data.user})
            }
            })
            .catch(err => {
            console.error(err);
            });

        await axios
            .get(`${API_URL}/charity/${this.username}`)
            .then(response => {
                if (response.data.status) {
                    console.log(response.data);
                    this.setState({
                        charity:response.data.charity
                    }, ()=>{})
                    setTimeout(() => {
                      this.setState({
                        isLoading: false
                      })
                    }, 2000);
                }
            })
            .catch(err => {
                alert('Something went wrong');
                console.log('Error: ' + err.message);
                this.setState({
                  isLoading: false
                })
            });
            this.getAccountTransactions(this.state.charity.meta_wallet_address);
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
    
    async loadWeb3() {
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

    async loadWallet() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({
            account: accounts[0]
        })
    }

    async loadSmartConrtact(e) {
        let web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const fundEthData = fundEth.networks[networkId];
        if (fundEthData) {
            const fundEth_Contract = await new web3.eth.Contract(
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

    async getAccountTransactions(accAddress) {
        if(this.state.smartContractLoaded && this.state.charity) {
            // You can do a NULL check for the start/end blockNumber
            let web3 = window.web3;
            let endBlockNumber = 0;
            let { contractAddress } = this.state;
            console.log(contractAddress)

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
            this.setState({
                expenses: t_expenses.reverse(),
                areExpensesLoaded: true
            })
            console.log(`expenses: ${this.state.expenses}`);
            console.log(JSON.stringify(this.state.expenses));
        }
    }

    async sendEth(ethAmount) {
      console.log('eth : ' + ethAmount);
      if (this.state.smartContractLoaded) {
        try {
          await this.state.fundEthContract.methods
            .createDonation(
              this.state.charity.meta_wallet_address,
              Math.floor(new Date().getTime() / 1000),
              false,
              this.state.user.name,
              this.state.user.user_id,
              this.state.charity.name,
              this.state.charity.user_id
            )
            .send({
              from: this.state.account,
              value: Web3.utils.toWei(ethAmount, 'ether'),
            })
            .then(async res => {
              console.log(res);
              console.log('transaction successfull.');
              window.web3.eth.getBalance(this.state.account).then(value => {
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
  
    viewCertDoc(e) {
      e.preventDefault();
      if (this.state.charity.charityDetails && this.state.charity.charityDetails.tax_exc_cert) {
        // const fileURI = charity.charityDetails.tax_exc_cert.replace('data:application/pdf;base64,', '');
        window.open(this.state.charity.charityDetails.tax_exc_cert, '_blank');
        // pdfWindow.document.write('<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' + encodeURI(fileURI) + '\'></iframe>');
      } else {
        window.alert('Tax Exemption Certificate Not Available');
      }
    }
  
    async donateEth() {
      const apiLink = `https://min-api.cryptocompare.com/data/price?fsym=${this.state.selectedCurrency.value}&tsyms=ETH`;
      console.log('LINK: ' + apiLink);
      await axios
        .get(apiLink)
        .then(response => {
          console.log('response: ' + JSON.stringify(response));
  
          if (response.data.ETH) {
            console.log(response.data.ETH);
            const mult = response.data.ETH;
            // eslint-disable-next-line
            const convertedEthValue = eval(this.state.ethAmount * mult);
            console.log('convertedEthValue: ' + convertedEthValue);
            this.sendEth(
              convertedEthValue
                .toString()
                .substr(
                  0,
                  convertedEthValue.toString().length -
                    (convertedEthValue.toString().length - 20)
                )
            );
          } else {
            this.sendEth(this.state.ethAmount.toString());
          }
        })
        .catch(err => {
          console.error(err);
        });
    }

    render() {
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
                  // bg={useColorModeValue('gray.100', 'gray.900')}
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
                        isLoaded={!this.state.isLoading}
                      >
                        <Image
                          w="12vw"
                          src={this.state.charity.profile_image}
                          borderRadius="full"
                        />
                      </SkeletonCircle>
                      <SkeletonText
                        isLoaded={!this.state.isLoading}
                        mb={'2vh'}
                        noOfLines={6}
                        spacing="4"
                      >
                        <VStack alignItems={'flex-start'}>
                          <Heading mb={'2vh'} fontSize={'46'}>
                            {this.state.charity.name}
                          </Heading>
                          <Text>
                            <b>Founded on:</b>{' '}
                            {this.state.charity.charityDetails &&
                            this.state.charity.charityDetails.founded_in
                              ? this.state.charity.charityDetails.founded_in
                              : ''}
                          </Text>
                          {/* <Text>
                            Total Funding: ₹{' '}
                            {this.state.charity.charityDetails &&
                            this.state.charity.charityDetails.total_fundings
                              ? this.state.charity.charityDetails.total_fundings
                              : ``}
                          </Text>
                          <Text>
                            Total expenditure: ₹{' '}
                            {this.state.charity.charityDetails &&
                            this.state.charity.charityDetails.total_expenditure
                              ? this.state.charity.charityDetails.total_expenditure
                              : ``}
                          </Text> */}
                        </VStack>
                      </SkeletonText>
                    </HStack>
                    <VStack>
                      <Skeleton isLoaded={!this.state.isLoading}>
                        <Select
                          defaultOptions
                          value={this.state.selectedCurrency}
                          options={currencies}
                          onChange={this.handleCurrencySelection}
                        />
                      </Skeleton>
                      <Skeleton isLoaded={!this.state.isLoading}>
                        <InputGroup>
                          <Input
                            placeholder={
                              'amount in ' +
                              this.state.selectedCurrency.symbolNative +
                              ' (eg. 245)'
                            }
                            onChange={e => {this.setState({ethAmount: e.target.value})}}
                          />
                        </InputGroup>
                      </Skeleton>
                      <Skeleton isLoaded={!this.state.isLoading}>
                        <Button
                          colorScheme={'teal'}
                          size={'lg'}
                          onClick={() => this.donateEth()}
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
                      <Skeleton isLoaded={!this.state.isLoading}>
                        <Button
                          colorScheme={'teal'}
                          size={'lg'}
                          onClick={e => this.viewCertDoc(e)}
                        >
                          Tax Certificate
                        </Button>
                      </Skeleton>
                      <Skeleton isLoaded={!this.state.isLoading}>
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
                    <Skeleton mt="2vh" mb="2vh" isLoaded={!this.state.isLoading}>
                      <Heading>Description</Heading>
                    </Skeleton>
      
                    <SkeletonText isLoaded={!this.state.isLoading} noOfLines={12} spacing="6">
                      {this.state.charity.description ? (
                        <Text align={'justify'}>{this.state.charity.description}</Text>
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
                      isLoaded={!this.state.isLoading}
                    >
                      <Heading alignSelf={'start'} paddingTop={'5'}>
                        Latest Expenses
                      </Heading>
                    </Skeleton>
                    {
                      this.state.expenses.length==0 && this.state.areExpensesLoaded?
                      <Stack
                        borderWidth="2px"
                        borderRadius="lg"
                        w={'45vw'}
                        height={'14vh'}
                        direction={{ base: 'column', md: 'row' }}
                        boxShadow={'2xl'}
                        padding={4}
                        cursor={'pointer'}
                      >
                        <HStack width={'40vw'} justifyContent={'space-between'} m="1vw">
                          <VStack spacing={2} align={'start'} m="1vw">
                              <Text
                                as="b"
                                align={'left'}
                                fontSize={{ sm: 'lg', md: 'xl' }}
                                noOfLines={2}>
                                No Expense Data Found
                              </Text>
                          </VStack>
                        </HStack>
                      </Stack>
                      :null

                    }
                    {
                    this.state.expenses.map((expense, index) => (
                      <React.Fragment key={index}>
                          <ReportCard
                            view={'doner'}
                            blockHash={expense.blockHash}
                            expense={expense}
                            isLoaded={this.state.areExpensesLoaded}
                            title={expense.reason}
                            getReason={this.getExpenseReason}
                            date={expense.date}
                            value={expense.value}
                          />
                      </React.Fragment>
                    ))
                    }
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </>
        )
    }
}

export default CharityDetails