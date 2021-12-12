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
import { FaUserAlt, FaLock, FaBirthdayCake } from 'react-icons/fa';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (<Flex
    flexDirection='column'
    width='100wh'
    height='100vh'
    //   backgroundColor="gray.200"
    justifyContent='center'
    alignItems='center'
    marginTop='-50px'
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
        <form>
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
                <Input type='text' placeholder='Full Name' />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.300' />}
                />
                <Input type='text' placeholder='Username' />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<CFaUserAlt color='gray.300' />}
                />
                <Input type='email' placeholder='Email Address' name='email' />
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
                  name='current-password'
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleShowClick}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  children={<FaBirthdayCake color='gray.300' />}
                />
                <Input type='date' />
              </InputGroup>
            </FormControl>
            <Button
              borderRadius={0}
              type='submit'
              variant='solid'
              colorScheme='teal'
              width='full'
            >
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
  </Flex>);
};

export default Register;