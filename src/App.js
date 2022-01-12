import React, { PureComponent } from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import {
  ChakraProvider, Box, theme,
} from '@chakra-ui/react';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import NgoRegister from './Components/NgoRegister';
import UserHome from './Components/UserHome';
import About from './Components/About';
import NgoInformation from './Components/NgoInformation'


class App extends PureComponent {
  render() {
    return (<>
      <ChakraProvider theme={theme}>
        <Box textAlign='center' fontSize='xl'>
          <Navbar>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/ngoRegister' component={NgoRegister} />
              <Route exact path='/userHome' component= {UserHome} />
              <Route exact path='/about' component= {About} />
              <Route exact path='/ngoInformation' component= {NgoInformation} />
            </Switch>
          </Navbar>
        </Box>
      </ChakraProvider>
    </>);
  }
}

export default App;
