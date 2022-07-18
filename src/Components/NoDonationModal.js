import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'

function NoDonationModal() {
    const { onOpen} = useDisclosure()
    
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal closeOnOverlayClick={false} isOpen={true} isCentered >
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
            <ModalContent>
                <ModalHeader>Donation Data Not Found!</ModalHeader>
                <ModalBody pb={6}>
                    The information about requested donation does not exists yet!
                </ModalBody>
            </ModalContent>
            </Modal>
    </>
    )
}

export default NoDonationModal