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
  Link,
  FormErrorMessage,
} from "@ui/index";
import { HiEye, HiEyeOff } from "react-icons/hi";

export const PasswordField = forwardRef<
  HTMLInputElement,
  InputProps & {
    label: string;
    forgotPasswordLabel: string;
    error?: FieldError;
  }
>(({ label, forgotPasswordLabel, error, ...rest }, ref) => {
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
    <FormControl id="password" isInvalid={!!error}>
      <Flex justify="space-between">
        <FormLabel>{label}</FormLabel>
        <Link fontWeight="semibold" fontSize="sm">
          {forgotPasswordLabel}
        </Link>
      </Flex>
      <InputGroup>
        <Input
          ref={mergeRef}
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
  );
});

PasswordField.displayName = "PasswordField";
