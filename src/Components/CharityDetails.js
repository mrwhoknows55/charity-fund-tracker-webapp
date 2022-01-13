import { Button, Flex, Heading, HStack, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function CharityDetails() {
  const { username } = useParams();
  const [charity, setCharity] = useState({});

  useEffect(() => {
    axios.get(`https://fundtracking.herokuapp.com/charity/${username}`)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setCharity(response.data.charity);
        }
      }).catch((err) => {
      alert('Something went wrong');
      console.log('Error: ' + err.message);
    });
  }, []);

  function viewCertDoc(e) {
    e.preventDefault();
    if (charity.charityDetails && charity.charityDetails.tax_exc_cert) {
      const fileURI = charity.charityDetails.tax_exc_cert.replace('data:application/pdf;base64,', '');
      let pdfWindow = window.open('');
      pdfWindow.document.write('<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' + encodeURI(fileURI) + '\'></iframe>');
    } else {
      window.alert("Tax Exemption Certificate Not Available")
    }
  }

  return (<>
    <VStack order={'column'} overflow={'hidden'} spacing={8} maxWidth={'100%'} width={'100%'}>
      <VStack py={'2vh'} marginTop={'2vh'}>
        <Flex px={'2vw'} w={'100vw'} h={'35vh'} bg={useColorModeValue('gray.100', 'gray.900')}>
          <HStack w={'100vw'} spacing={'5vw'} justifyContent={'space-between'}>
            <HStack spacing={'2vw'}>
              <Image marginStart={'2vw'} w='12vw' src={charity.profile_image} borderRadius='full' />
              <VStack alignItems={'flex-start'}>l
                <Heading mb={'2vh'}>
                  {charity.name}
                </Heading>
                <Text>
                  Founded
                  on: {(charity.charityDetails && charity.charityDetails.founded_in) ? charity.charityDetails.founded_in : ''}
                </Text>
                <Text>
                  Total
                  Funding: ₹ {(charity.charityDetails && charity.charityDetails.total_fundings) ? charity.charityDetails.total_fundings : ``}
                </Text>
                <Text>
                  Total
                  expenditure: ₹ {(charity.charityDetails && charity.charityDetails.total_expenditure) ? charity.charityDetails.total_expenditure : ``}
                </Text>
              </VStack>
            </HStack>
            <VStack spacing={'1vw'} alignItems={'center'} paddingRight={'2vw'}>
              <Button background={'green.400'} textColor={'black'}>
                Donate Funds
              </Button>
              <Button background={'yellow.400'}  textColor={'black'} onClick={(e) => viewCertDoc(e)}>
                Tax Certificate
              </Button>
              <Button background={'orange.500'} textColor={'black'}>
                Expense Report
              </Button>
            </VStack>
          </HStack>
        </Flex>
        <VStack paddingTop={'2vh'} alignSelf={'flex-start'} alignItems={'flex-start'} width={'50vw'}
                paddingStart={'100px'}>

          <Heading>
            Description
          </Heading>

          <Text align={'justify'}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aperiam enim quo recusandae vero! Culpa hic
            impedit maxime quaerat voluptate. Debitis dolores fugiat harum laboriosam libero modi provident? Aliquam
            amet at
            autem corporis culpa cumque, dolore ea eius enim ex fugiat illo impedit in libero maiores minus nobis
            officia
            pariatur perferendis possimus qui quibusdam quisquam quos ratione rem repellat rerum sequi similique sint
            soluta
            tenetur totam vel voluptatem. Atque aut autem blanditiis consectetur cumque debitis delectus deleniti dolore
            doloribus et eveniet facere id ipsum maiores maxime molestias necessitatibus nisi, nostrum omnis quae qui
            quidem
            quisquam recusandae sit soluta sunt voluptas voluptatem! A ducimus eum eveniet id illum nisi saepe
            veritatis,
            voluptatum. Ab beatae culpa delectus dicta distinctio dolorem doloribus eaque earum eius enim est eveniet ex
            facere in, minima mollitia natus obcaecati odio odit officia optio perspiciatis quasi quidem sunt
            voluptates? A
            ad aliquam autem cupiditate debitis doloremque dolores, fugit ipsa labore optio perspiciatis reiciendis sunt
            voluptates? Aliquam eligendi eos error hic in non repudiandae saepe temporibus voluptatum. Ab animi autem
            eos
            nihil perspiciatis quae quibusdam repellendus rerum? Culpa, cum delectus dolorem doloribus eligendi facere
            fugit
            incidunt laborum odio perspiciatis placeat porro quas quasi quibusdam repudiandae unde, voluptates?
            Accusamus,
            distinctio?
          </Text>

        </VStack>
      </VStack>
    </VStack>
  </>)
    ;
}

export default CharityDetails;
