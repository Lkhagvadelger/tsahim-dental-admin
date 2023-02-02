import { ReactNode } from "react";
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@ui/index";

export const DataEntryModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  titleLabel,
  children,
  closeOnOverlayClick = true,
  ...props
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  title: string;
  titleLabel?: string;
  children: ReactNode | ReactNode[];
}) => {
  return (
    <Modal
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      {...props}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={true}
    >
      <ModalOverlay />
      <ModalContent
      overflow={"auto"}
        maxW={"70rem"}
        minW={"100px"}
        maxH={"90%"}
        _light={{ bg: "#fdfdff" }}
        _dark={{ bg: "gray.900" }}
      >
        <ModalHeader>
          <Heading color="blue.700" fontWeight={900} fontSize={"large"}>
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton mt={2}  />
        <ModalBody >{children}</ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
