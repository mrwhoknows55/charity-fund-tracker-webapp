import { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import axios from 'axios';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleShowClick = () => setShowPassword(!showPassword);

  const loginUser = (e) => {
    e.preventDefault();
    axios.post('https://fundtracking.herokuapp.com/doners/login', { email: email, password: password })
      .then(response => {
        console.log(response);
        if (response.data && response.data.access_tocken) {
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
    height='100vh'
    justifyContent='center'
    alignItems='center'>
    <Stack
      flexDir='column'
      mb='2'
      justifyContent='center'
      alignItems='center'
    >
      <Avatar bg='teal.500' />
      <Heading color='teal.400'>Welcome</Heading>
      <Box minW={{ base: '90%', md: '468px' }}>
        <form onSubmit={loginUser}>
          <Stack
            spacing={4}
            p='1rem'
            //   backgroundColor="current"
            boxShadow='md'
          >
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.300' />}
                />
                <Input type='email' placeholder='email address' value={email} onChange={e => setEmail(e.target.value)}
                       required />
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={password} onChange={e => setPassword(e.target.value)}
                  required
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleShowClick}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button borderRadius={0} type='submit' variant='solid' colorScheme='teal' width='full'>
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
    <Box>
      New to us?{' '}
      <Link color='teal.500' href={'/register'}>
        Sign Up
      </Link>
    </Box>
  </Flex>);
};

export default Login;