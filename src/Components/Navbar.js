import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { children } = props;
  const [name, setName] = useState('');
  const [homeURI, setHomeURI] = useState('/');
  const [accountType, setAccountType] = useState('');
  const [username, setUsername] = useState('Guest');
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileImg, setProfileImg] = useState('https://avatars.dicebear.com/api/male/username.svg');

  useEffect(() => {
    const access_token = window.sessionStorage.getItem('access_token');
    setAccountType(window.sessionStorage.getItem('account_type'));
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
            if (accountType && (accountType === '' || accountType === 'doner')) {
              console.log('homeURI: /');
              setHomeURI('/');
            } else {
              console.log('homeURI: ' + accountType);
              setHomeURI(`/${accountType}`);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log('Navbar: user is not logged in yet');
    }
  }, []);

  const onEditProfile = (e) => {
    e.preventDefault();
    //TODO
    window.alert('Edit Profile Clicked');
  };

  const onLogout = (e) => {
    e.preventDefault();
    const access_token = window.sessionStorage.getItem('access_token');
    if (access_token != null) {
      axios.post('https://fundtracking.herokuapp.com/user/logout', undefined, { headers: { 'Authorization': 'Bearer ' + access_token } })
        .then(response => {
          console.log(response);
          if (response.data.status) {
            console.log('successfully logged out!');
            window.sessionStorage.setItem('access_token', 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
            window.sessionStorage.setItem('account_type', '');
          } else {
            console.log('something went wrong!');
          }
        }).catch(e => {
        window.sessionStorage.setItem('account_type', '');
        window.sessionStorage.setItem('access_token', 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
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
        px={'6vw'}
        zIndex={4}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Heading fontSize={'2xl'}>Fund Tracking</Heading>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <a href={homeURI}>
                <Button>Home`</Button>
              </a>
              {
                (accountType === 'admin') ?
                  <>
                    {/*TODO Create these pages*/}
                    <a href={'/admin/charities'}>
                      <Button>Charities</Button>
                    </a>
                    <a href={'/admin/donors'}>
                      <Button>Donors</Button>
                    </a>
                  </> : <></>
              }
              <a href={'/about'}>
                <Button>About</Button>
              </a>
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
                    <p style={{ 'fontWeight': '600', fontSize: '22px' }}>{name}</p>
                  </Center>
                  <Center>
                    <p>{username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {
                    (loggedIn) ? <>
                        <MenuItem onClick={(e) => onLogout(e)}>
                          Logout
                        </MenuItem>
                        <MenuItem onClick={(e) => onEditProfile(e)}>
                          Edit Profile
                        </MenuItem>
                      </>
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
