import React, { PureComponent } from 'react'
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import {
    ChakraProvider,
    Box,
    // VStack,
    Grid,
    theme,
    // Heading,
} from '@chakra-ui/react';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
import Home from './Components/Home';
import Navbar from './Components/Nav/navbar';
import Login from './Components/Login';
import Register from './Components/Register';

class App extends PureComponent {
    render() {
        return (
            <>
                <ChakraProvider theme={theme}>
                    <Box textAlign='center' fontSize='xl'>
                        <Navbar>
                            <Grid minH='100vh' p={3}>
                                <Switch>
                                    <Route exact path='/' component={Home}/>
                                    <Route exact path='/login' component={Login}/>
                                    <Route exact path='/register' component={Register}/>
                                </Switch>
                            </Grid>
                        </Navbar>
                    </Box>
                </ChakraProvider>
            </>
        )
    }
}

export default App;
