import { Avatar, Button, Center, Heading, HStack, VStack } from '@chakra-ui/react';
import DonationCard from './DonationCard';
import ReportCard from './ReportCard';

const donations = [
  {
    avatarUrl: 'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'Donor Name',
    date: 'DD-MM-YYYY',
    value: '12346',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'Donor Name',
    date: 'DD-MM-YYYY',
    value: '12346',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'Donor Name',
    date: 'DD-MM-YYYY',
    value: '12346',
  },
];

const expenses = [
  {
    title: 'RO Purifying machine',
    date: '23-04-2021',
    value: '7,80,000',
  },
  {
    title: 'Books for school students',
    date: '13-02-2021',
    value: '10,80,000',
  },
  {
    title: 'New sports equipments on playgrounds',
    date: '2-11-2020',
    value: '4,80,000',
  },
];

export default function CharityHome() {
  return (
    <>
      <Center>
        <HStack spacing={8} align={'start'}>
          <VStack spacing={8} marginTop={90}>
            <HStack spacing={2}>
              <Avatar
                size={'2xl'}
                src={donations[0].avatarUrl}
                alt={'Avatar Alt'}
                mb={4}
                pos={'relative'}
              />
              <VStack align={'start'} padding={10}>
                <Heading>
                  Charity Name
                </Heading>
                <Button colorScheme={'teal'} size={'md'}>
                  Edit Profile
                </Button>
              </VStack>
            </HStack>
            {
              donations.map((donation) =>
                <DonationCard
                  avatarUrl={donation.avatarUrl}
                  name={donation.name}
                  date={donation.date}
                  value={donation.value}
                />,
              )
            }
          </VStack>
          <VStack spacing={8} px={12} py={24} marginTop={90}>
            <HStack justifyContent={'end'} width={'40vw'}>
              <Button colorScheme={'teal'} size={'lg'}>Add Expense</Button>
              <Button colorScheme={'teal'} size={'lg'}>Add Report</Button>
            </HStack>
            <Heading alignSelf={'start'} paddingTop={'5'}>
              Latest Expenses
            </Heading>
            {
              expenses.map((expense) =>
                <ReportCard
                  title={expense.title}
                  date={expense.date}
                  value={expense.value}
                />
              )
            }
          </VStack>
        </HStack>
      </Center>
    </>
  );
}
