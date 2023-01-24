import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
} from '@chakra-ui/react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../Constants';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleShowClick = () => setShowPassword(!showPassword);

  const history = useHistory();

  const loginUser = e => {
    e.preventDefault();

    axios
      .post(`${API_URL}/user/login`, {
        email: email,
        password: password,
      })
      .then(response => {
        console.log(response);
        if (response.data && response.data.access_token) {
          const token = response.data.access_token;
          const accountType = response.data.account_type ? response.data.account_type : '';
          console.log('token', token);
          window.sessionStorage.setItem('access_token', token);
          window.sessionStorage.setItem('account_type', accountType);

          if (accountType === 'admin') {
            console.log('Admin Login');
            history.replace('/admin');
          } else if (accountType === 'charity') {
            console.log('Charity Login');
            history.replace('/charity');
          } else {
            console.log('Regular Login');
            history.replace('/');
          }
          window.location.reload();
        } else {
          const err = response.data.message;
          throw Error('Error: ' + err);
        }
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.message);
      });
  };

  return (
    <Flex
      flexDirection='column'
      width='100wh'
      height='100vh'
      justifyContent='center'
      alignItems='center'
    >
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
                    children={<CFaUserAlt color='gray.500' />}
                  />
                  <Input
                    type='email'
                    placeholder='Email Address'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    children={<CFaLock color='gray.500' />}
                  />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={20}
                type='submit'
                variant='solid'
                colorScheme='teal'
                width='full'
              >
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
    </Flex>
  );
};

export default Login;
