import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';

export default function CharityCard(props) {
  const charity = props.charity;
  const isLoaded = props.isLoaded;
  const openCharityDetails = props.openCharityDetails;
  return (
    <>
      <Box
        onClick={e => openCharityDetails(e, charity.username)}
        role={'group'}
        p={6}
        maxW={'22vw'}
        w={'full'}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Skeleton isLoaded={isLoaded} mt="16">
          <Box
            rounded={'lg'}
            mt={-12}
            pos={'relative'}
            height={'28vh'}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 5,
              left: 0,
              backgroundImage: `url(${charity.profile_image})`,
              filter: 'blur(10px) ',
              boxShadow:
                'inset 0 0 120px #000, inset 0 0 80px #000, inset 0 0 40px #000',
              zIndex: -2,
            }}
            _groupHover={{
              _after: {
                filter: 'blur(20px)',
              },
            }}
          >
            <Image
              marginLeft="auto"
              marginRight="auto"
              marginTop="2vh"
              marginBottom="auto"
              rounded={'lg'}
              height={'25vh'}
              width={'15vw'}
              objectFit={'cover'}
              src={charity.profile_image}
            />
          </Box>
        </Skeleton>

        <Stack pt={10} align={'center'}>
          <SkeletonText isLoaded={isLoaded} m="8" noOfLines={6} spacing="4">
            <Heading
              as="h1"
              fontSize={'3xl'}
              fontFamily={['body', 'Lucida Bright']}
              fontWeight={700}
            >
              {charity.name}
            </Heading>
            <Text align="justify">
              {charity.description
                ? charity.description.substring(0, 340) + '...'
                : 'This NGO is working since 2000. In this 20 years we taking many activities for\n' +
                  '                      needy people and also we donated money to desaster management commities...'}
            </Text>
            <br />
            {/* <Flex direction={'column'}>
              <Stack direction={'row'} align="flex-start">
                <Text fontWeight={600} fontSize={'xl'}>
                  Funds: ₹ {charity.total_fundings}
                </Text>
              </Stack>
              <Stack direction={'row'} align="flex-start">
                <Text fontWeight={600} fontSize={'xl'}>
                  Expenditure: ₹ {charity.total_expenditure}
                </Text>
              </Stack>
            </Flex> */}
          </SkeletonText>
          <Skeleton isLoaded={isLoaded} m="8">
            <Flex paddingTop={'2vh'}>
              <Button
                background={'teal.500'}
                textColor={'white'}
                onClick={e => openCharityDetails(e, charity.username)}
              >
                {' '}
                More Information{' '}
              </Button>
            </Flex>
          </Skeleton>
        </Stack>
      </Box>
    </>
  );
}
