import React, { useEffect, useState } from 'react';
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
import { getCookie } from '../utils/getCookie';
import axios from 'axios';

export default function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { children } = props;
  const [name, setName] = useState('');
  const [username, setUsername] = useState('Guest');
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileImg, setProfileImg] = useState('https://avatars.dicebear.com/api/male/username.svg');

  useEffect(() => {
    let access_token = getCookie('access_token');
    if (access_token) {
      axios
        .get('https://fundtracking.herokuapp.com/user/profile', {
          headers: { Authorization: 'Bearer ' + access_token },
        })
        .then(response => {
          if (response.data.status) {
            setUsername(response.data.user.username);
            setLoggedIn(true);
            setProfileImg(response.data.user.profile_image);
            setName(response.data.user.name);
            console.log(response.data.user.username);
          }
        });
    }
  });

  const onLogout = (e) => {
    e.preventDefault();
    const access_token = getCookie('access_token');
    if (access_token != null) {
      axios.post('https://fundtracking.herokuapp.com/user/logout', undefined, { headers: { 'Authorization': 'Bearer ' + access_token } })
        .then(response => {
          console.log(response);
          if (response.data.status) {
            console.log('successfully logged out!');
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          } else {
            console.log('something went wrong!');
          }
        }).catch(e => {
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        console.log(e);
      }).finally(() => {
        window.location.href = '/login';
      });
    } else {
      console.log('already logged out!');
      window.location.href = '/login';
    }
  };

  return (
    <>
      <Box
        position={'fixed'}
        width={'100vw'}
        height={'auto'}
        bg={useColorModeValue('gray.100', 'gray.900')}
        px={"6vw"}
        zIndex={4}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>FundTracking</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {/* Dummy Button for UserHome Start*/}

              <a href={'/'}>
                <Button>Home</Button>
              </a>
              <a href={'/ngoInformation'}>
                <Button>NGO</Button>
              </a>
              <a href={'/about'}>
                <Button>About</Button>
              </a>

              {/* Dummy Button for UserHome Ends */}

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={profileImg}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={profileImg}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p style={{'fontWeight':'600' , fontSize:'22px' }} >{name}</p>
                  </Center>
                  <Center>
                    <p>{username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {
                   
                   (loggedIn) ?
                      <MenuItem onClick={(e) => onLogout(e)}>
                        Logout
                        
                      </MenuItem>
                      :
                      <MenuItem onClick={() => {
                        window.location.href = '/login';
                      }}>
                        Login
                      </MenuItem>
                  }
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      {children}
    </>
  );
}
