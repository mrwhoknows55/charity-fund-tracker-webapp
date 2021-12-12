import React, {useEffect, useState} from 'react';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {getCookie} from '../utils/getCookie';
import axios from 'axios';

export default function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { children } = props;
  const [username, setUsername] = useState("Guest");

  useEffect(()=>{
    let access_token = getCookie("access_token");
    if(access_token) {
      axios.get('https://fundtracking.herokuapp.com/doners/profile', {
        headers: { 'Authorization': 'Bearer ' + access_token}
      }).then(response => {
        if(response.data.status) {
          setUsername(response.data.username);
          console.log(response.data.username);
        }
      })
    }
  });

  return (<>
    <Box position={'fixed'} width={'100vw'} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>FundTracking</Box>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            
            
            {/* Dummy Button for UserHome Start*/}
            
            <a href={'/userHome'}><Button>Home</Button></a>
         
            
            {/* Dummy Button for UserHome Ends */}


            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={'https://avatars.dicebear.com/api/male/username.svg'}
                />
              </MenuButton>
              <MenuList alignItems={'center'}>
                <br />
                <Center>
                  <Avatar
                    size={'2xl'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </Center>
                <br />
                <Center>
                  <p>{username}</p>
                </Center>
                <br />
                <MenuDivider />
                <a href={'/login'}><MenuItem>Login</MenuItem></a>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
    {children}
  </>);
}