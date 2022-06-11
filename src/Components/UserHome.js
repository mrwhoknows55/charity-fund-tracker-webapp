import React, { useEffect, useState } from 'react';
import { Center, SimpleGrid, VStack, Skeleton } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CharityCard from './CharityCard';

export default function ProductSimple() {
  const history = useHistory();
  const [charities, setCharities] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (window.sessionStorage.getItem('account_type') === 'admin') {
      history.replace('/admin');
    } else if (window.sessionStorage.getItem('account_type') === 'charity') {
      history.replace('/charity');
    }

    axios
      .get('https://fundtracking.herokuapp.com/charity')
      .then(response => {
        if (response.data.status) {
          setCharities(response.data.charities);
          console.log(response.data.charities);
          setTimeout(() => {
             setLoading(false);
          }, 2000)
        }
      })
      .catch(err => {
        alert('Something went wrong');
        setLoading(false);
        console.log('Error: ' + err.message);
      });
  }, []);

  function openCharityDetails(e, charityId) {
    e.preventDefault();
    history.push(`/charity/${charityId}`);
    console.log(charityId);
  }

  return (
    <VStack spacing={8}>
      <Center py={12} marginTop={90}>
        <SimpleGrid columns={4} spacing={'8'}>
          {charities.map(charity => (
            <React.Fragment key={charity.charity_id}>
                <CharityCard
                  charity={charity}
                  openCharityDetails={openCharityDetails}
                  isLoaded={!isLoading}
                />
              {/* <Skeleton isLoaded={!isLoading}>

              </Skeleton> */}
            </React.Fragment>
          ))}
        </SimpleGrid>
      </Center>
    </VStack>
  );
}
