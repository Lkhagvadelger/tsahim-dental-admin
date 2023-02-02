import { forwardRef, useRef } from "react";
import { FieldError } from "react-hook-form";
import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
  FormErrorMessage,
  InputLeftElement,
} from "@ui/index";
import { HiEye, HiEyeOff } from "react-icons/hi";
import {
  IoCallSharp,
  IoLockClosed,
  IoSyncCircleOutline,
} from "react-icons/io5";

export const PasswordFieldWithConfirm = forwardRef<
  HTMLInputElement,
  InputProps & {
    label: string;
    confirmLabel: string;
    error?: FieldError;
  }
>(({ label, confirmLabel, error, ...rest }, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  const mergeRef = useMergeRefs(inputRef, ref);

  const onClickReveal = () => {
    onToggle();
    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      const length = input.value.length * 2;
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length);
      });
    }
  };

  return (
    <>
      <FormControl id="password" isInvalid={!!error}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="blue.50">
            <IoLockClosed />
          </InputLeftElement>

          <Input
            pl={10}
            ref={mergeRef}
            placeholder="Create a unique password"
            name="password"
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            required
            {...rest}
          />
          <InputRightElement>
            <IconButton
              bg="transparent !important"
              variant="ghost"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
      </FormControl>
      <FormControl id="confirmPassword" isInvalid={!!error}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="blue.50">
            <IoSyncCircleOutline />
          </InputLeftElement>

          <Input
            pl={10}
            ref={mergeRef}
            placeholder="Repeat the password to confirm"
            name="passwordConfirm"
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            required
            {...rest}
          />
          <InputRightElement>
            <IconButton
              bg="transparent !important"
              variant="ghost"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </>
  );
});

PasswordFieldWithConfirm.displayName = "PasswordFieldWithConfirm";
