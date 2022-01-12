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
  Image,
} from '@chakra-ui/react';
import {
  FaUserAlt, FaLock, FaBirthdayCake, FaWallet, FaEnvelopeOpen, FaEye, FaEyeSlash, FaPhone, FaFile,FaImage,
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
  const [certificate, setCertificate] = useState('');
  const [logo, setLogo] = useState('');
//   const [dob, setDob] = useState('');

  const submit = (e) => {
    e.preventDefault();

    axios.post('https://fundtracking.herokuapp.com/doners/ngoRegister', {
      name: name,
      phone1: phone,
      email: email,
      password: password,
      founded_in: "24-10-2000" ,
      username: userName,
      logo:logo,
      certificate: certificate,
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
    height='80vh'
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
            spacing={5}
            p='1rem'
            boxShadow='2xl'
          >
            <VStack justifyContent={'center'} flexDirection={'column'} justifyItems={'center'}>
              <Avatar bg='teal.500' />
              <Heading color='teal.400' >NGO SignUp</Heading>
            </VStack>

            <FormControl >
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.500' />}
                />
                <Input isRequired={true} _placeholder={{ color: 'gray.300' }} value={name}
                       onChange={e => setName(e.target.value)} type='text' placeholder='NGO Name' />
              </InputGroup>
            </FormControl>
            
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.500' />}
                />
                <Input isRequired={true} _placeholder={{ color: 'gray.300' }} type='text' placeholder='Username'
                       value={userName} onChange={e => setUserName(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  children={<FaEnvelopeOpen color='gray.500' />}
                />
                <Input
                //   isRequired={true}
                  _placeholder={{ color: 'gray.300' }}
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
                  
                  color='gray.500'
                  children={<FaPhone color='gray.500' />}
                />
                <Input
                  isRequired={true}
                  _placeholder={{ color: 'gray.300' }}
                  type='number'
                  placeholder='Phone No'
                  name='phone'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            
            {/* <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  children={<FaBirthdayCake color='gray.500' />}
                />
                <Input
                  isRequired={true}
                  _placeholder={{ color: 'gray.300' }}
                  ref={dateRef} type='text' placeholder='mm/dd/yyyy' onFocus={() => dateRef.current.type = 'date'}
                  onBlur={() => dateRef.current.type = 'text'}
                  value={dob} onChange={e => setDob(e.target.value)}
                />
              </InputGroup>
            </FormControl>
             */}

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  children={<CFaLock color='gray.500' />}
                />
                <Input
                  _placeholder={{ color: 'gray.300' }}
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


{/* File Uploading Start*/}
            
<FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  children={<FaFile color='gray.500' />}
                />
                <Input

                  _placeholder={{ color: 'gray.300' }}
                  placeholder='Upload 80G Certi'
                />
                <InputRightElement width='16rem'>
                 
                 <Input
                    required='true'
                   _placeholder={{ color: 'gray.300' }}
                   type="file"
                   placeholder='Upload 80G Certificate'
                   name='certificate'
                   value={certificate} onChange={e => setCertificate(e.target.value)}
                 />
                 </InputRightElement>
               
              </InputGroup>
            </FormControl>
{/* File Uploading End*/}


{/* Logo Uploading Start*/}
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  children={<FaFile color='gray.500' />}
                />
                <Input

                  _placeholder={{ color: 'gray.300' }}
                  placeholder='Upload Logo'
                />
                <InputRightElement width='18rem'>
                 
                 <Input
                    required='true'
                   _placeholder={{ color: 'gray.300' }}
                   type="file"
                   placeholder='Upload Logo'
                   name='logo'
                   value={logo} onChange={e => setLogo(e.target.value)}
                 />
                 </InputRightElement>
               
              </InputGroup>
            </FormControl>
{/* Logo Uploading End*/}

            
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  children={<FaWallet color='gray.500' />}
                />
                <Input isRequired={true} _placeholder={{ color: 'gray.300' }} type='text' value={walletAddress}
                       placeholder='Wallet Address' required disabled />
              </InputGroup>
            </FormControl>
            
            <Button
              borderRadius={20}
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
    </Box>
    <Box>
      User Sign Up?{' '}
      <Link color='teal.500' href={'/Register'}>
        User SignUp
      </Link>
    </Box>
  </Flex>);
};

const NgoRegister = () => {

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

export default NgoRegister;