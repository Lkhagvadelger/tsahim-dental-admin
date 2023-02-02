import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  BoxProps,
  Button,
  useColorModeValue,
  useDisclosure,
} from "@ui/index";
import React from "react";

export const DeleteConfirmation = ({
  isOpen,
  onOpen,
  onClose,
  onConfirm,
  isLoading = false
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) => {
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Устгах үйлдэл</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Та устгахдаа итгэлтэй байна уу?</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>Үгүй</Button>
            <Button isLoading={isLoading} variant={"delete"} ml={3} onClick={onConfirm}>
              Тийм
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
