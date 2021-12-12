import { createRef, useEffect, useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import {
  FaUserAlt, FaLock, FaBirthdayCake, FaWallet, FaEnvelopeOpen, FaEye, FaEyeSlash, FaPhone,
} from 'react-icons/fa';
import ConnectingToWallet from './ConnectingToWallet';
import axios from 'axios';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignUp = (props) => {
  const handleShowClick = () => setShowPassword(!showPassword);
  const dateRef = createRef();
  const [showPassword, setShowPassword] = useState(false);

  const { walletAddress } = props;
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');

  const submit = (e) => {
    e.preventDefault();

    axios.post('https://fundtracking.herokuapp.com/doners/register', {
      name: name,
      phone1: phone,
      email: email,
      password: password,
      dob: dob,
      username: userName,
      meta_wallet_address: walletAddress,
    })
      .then(response => {
        console.log(response);
        if (response.data.status && response.data.access_token) {
          const token = response.data.access_token;
          console.log('token', token);
          document.cookie = 'access_token=' + token;
          window.location.href = '/userHome';
        } else {
          const err = response.data.message;
          throw Error('Error: ' + err);
        }
      }).catch(err => {
      console.log(err);
      window.alert(err.message);
    });
  };

  return (<Flex
    flexDirection='column'
    width='100wh'
    height='70vh'
    justifyContent='center'
    alignItems='center'>
    <Stack
      flexDir='column'
      mb='2'
      justifyContent='center'
      alignItems='center'>
      <Box minW={{ base: '90%', md: '469px' }}>
        <form
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <Stack
            spacing={4}
            p='1rem'
            boxShadow='lg'
          >
            <VStack justifyContent={'center'} flexDirection={'column'} justifyItems={'center'}>
              <Avatar bg='teal.500' />
              <Heading color='teal.400'>Sign Up</Heading>
            </VStack>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.300' />}
                />
                <Input isRequired={true} _placeholder={{ color: 'gray.200' }} value={name}
                       onChange={e => setName(e.target.value)} type='text' placeholder='Full Name' />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.300' />}
                />
                <Input isRequired={true} _placeholder={{ color: 'gray.200' }} type='text' placeholder='Username'
                       value={userName} onChange={e => setUserName(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaEnvelopeOpen color='gray.300' />}
                />
                <Input
                  isRequired={true}
                  _placeholder={{ color: 'gray.200' }}
                  type='email'
                  placeholder='Email Address'
                  name='email'
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaPhone color='gray.300' />}
                />
                <Input
                  isRequired={true}
                  _placeholder={{ color: 'gray.200' }}
                  type='number'
                  placeholder='Phone No'
                  name='phone'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaBirthdayCake color='gray.300' />}
                />
                <Input
                  isRequired={true}
                  _placeholder={{ color: 'gray.200' }}
                  ref={dateRef} type='text' placeholder='mm/dd/yyyy' onFocus={() => dateRef.current.type = 'date'}
                  onBlur={() => dateRef.current.type = 'text'}
                  value={dob} onChange={e => setDob(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<CFaLock color='gray.300' />}
                />
                <Input
                  _placeholder={{ color: 'gray.200' }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  name='current-password'
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleShowClick}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaWallet color='gray.300' />}
                />
                <Input isRequired={true} _placeholder={{ color: 'gray.200' }} type='text' value={walletAddress}
                       placeholder='Wallet Address' required disabled />
              </InputGroup>
            </FormControl>
            <Button
              borderRadius={5}
              type='submit'
              variant='solid'
              colorScheme='teal'
              width='full'>
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
    <Box>
      Have Account?{' '}
      <Link color='teal.500' href={'/login'}>
        Sign In
      </Link>
    </Box>;
  </Flex>);
};

const Register = () => {

  const { ethereum } = window;
  const [isMetamaskInstalled] = useState(ethereum !== undefined);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const requestMetamaskLogin = async () => {
    await ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        setWalletAddress(accounts[0]);
        console.log('Wallet Address: ', walletAddress);
        return true;
      }).catch((err) => {
        console.error(err);
        return false;
      });
  };

  useEffect(() => {

    if (walletAddress !== undefined || walletAddress !== '') {
      ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          console.log('User wallet has disconnected');
          setWalletAddress(undefined);
          setIsDisconnected(true);
        }
      });
    }

    if (isMetamaskInstalled) {
      console.log('Metamask in installed');
      if (requestMetamaskLogin()) {
      } else {
        setWalletAddress(undefined);
      }
    } else {
      console.log('Metamask in not installed');
    }
  }, []);

  return (<>
    <Flex width={'100vw'} justifyContent={'center'} justifyItems={'center'} pos={'fixed'} mt={'7rem'}>

      <VStack justifyContent={'center'}>

        {walletAddress && walletAddress !== '' ? <>
          <SignUp walletAddress={walletAddress} />
        </> : <>
          {!isDisconnected ? <>
            <ConnectingToWallet />
          </> : <>
            <Button onClick={() => {
              setIsDisconnected(!requestMetamaskLogin());
            }}>
              Retry
            </Button>
          </>}
        </>}

      </VStack>
    </Flex>
  </>);
};

export default Register;