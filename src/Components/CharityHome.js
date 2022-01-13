import { Avatar, Button, Center, Heading, HStack, VStack } from '@chakra-ui/react';
import DonationCard from './DonationCard';
import ReportCard from './ReportCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CharityHome() {

  const [profileImg, setProfileImg] = useState('https://avatars.dicebear.com/api/male/username.svg');
  const [charityName, setCharityName] = useState('Charity Name');
  const [expenses, setExpenses] = useState([]);
  const [donations, setDonations] = useState([]);
  const access_token = window.sessionStorage.getItem('access_token');

  useEffect(() => {
    axios.get('https://fundtracking.herokuapp.com/user/profile', {
      headers: { Authorization: 'Bearer ' + access_token },
    })
      .then(response => {
        if (response.data.status) {
          setProfileImg(response.data.user.profile_image);
          setCharityName(response.data.user.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    axios.get('https://fundtracking.herokuapp.com/charity/profile/expenses', { headers: { 'Authorization': 'Bearer ' + access_token } })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setExpenses(response.data.expenses);
          console.log(response.data.expenses);
        }
      })
      .catch((err) => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
      });

    axios.get('https://fundtracking.herokuapp.com/charity/profile/donations', { headers: { 'Authorization': 'Bearer ' + access_token } })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setDonations(response.data.donations);
          console.log(response.data.donations);
        }
      })
      .catch((err) => {
        alert('Something went wrong');
        console.log('Error: ' + err.message);
      });
  }, []);

  return (
    <>
      <Center>
        <HStack spacing={8} align={'start'}>
          <VStack spacing={8} marginTop={90} alignItems={'flex-start'}>
            <HStack spacing={2}>
              <Avatar
                size={'2xl'}
                src={profileImg}
                alt={'Avatar Alt'}
                pos={'relative'}
              />
              <VStack align={'start'} padding={10}>
                <Heading>
                  {charityName}
                </Heading>
                <Button colorScheme={'teal'} size={'md'}>
                  Edit Profile
                </Button>
              </VStack>
            </HStack>
            <Heading alignSelf={'start'} paddingTop={'5'}>
              Latest Donations
            </Heading>
            {
              donations.map((donation) =>
                <DonationCard
                  avatarUrl={donation.user_profile_image}
                  name={donation.user_name}
                  date={donation.date}
                  value={donation.amount}
                />,
              )
            }
          </VStack>
          <VStack spacing={8} px={12} py={24} marginTop={90}>
            <HStack spacing={8}>
              <Heading alignSelf={'start'} paddingTop={'5'}>
                Latest Expenses
              </Heading>
              <HStack justifyContent={'end'} width={'25vw'}>
                <Button colorScheme={'teal'} size={'lg'}>Add Expense</Button>
                <Button colorScheme={'teal'} size={'lg'}>Add Report</Button>
              </HStack>
            </HStack>
            {
              expenses.map((expense) =>
                <ReportCard
                  title={expense.reason}
                  date={expense.date}
                  value={expense.amount}
                />,
              )
            }
          </VStack>
        </HStack>
      </Center>
    </>
  );
}
