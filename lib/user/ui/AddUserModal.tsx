import {
  VStack,
  useDisclosure,
  Button,
  toaster,
  Flex,
  forwardRef,
  Textarea,
  Text,
  Box,
  Card,
} from "@ui/index";
import { useEffect, useImperativeHandle, useState } from "react";
import { DataEntryModal } from "@ui/components/DataEntryModal";
import { UserForm } from "./UserForm";
import { RegisterInputType } from "@lib/auth/data/authHooks";

const AddUser = (
  {
    refresh,
  }: {
    refresh: () => void;
  },
  ref: any
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState<
    RegisterInputType | undefined | null
  >();
  const [isPasswordUpdate, setIsPasswordUpdate] = useState<boolean | undefined>(
    false
  );
  useImperativeHandle(ref, () => ({
    onOpenEdit: (data: RegisterInputType, isPassowrdUpdate?: boolean) => {
      setUserData(data);
      setIsPasswordUpdate(isPassowrdUpdate);
      onOpen();
    },
  }));

  const closeDialog = () => {
    setUserData(null);
    onClose();
    refresh && refresh();
  };
  return (
    <DataEntryModal
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={() => {
        closeDialog();
      }}
      onOpen={onOpen}
      title={isPasswordUpdate ? "Change password" : "Register new user"}
      titleLabel={""}
    >
      <UserForm
        closeDialog={closeDialog}
        data={userData}
        refresh={refresh}
        isChangePassword={isPasswordUpdate}
      />
    </DataEntryModal>
  );
};

export const AddUserModal = forwardRef(AddUser);
