import { QueryParamType } from "@ui/hooks/query-param";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Stack,
} from "@ui/index";
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";

export const BotTableActions = ({
  params,
  setParam,
  onComplete,
  openNewModal,
}: {
  params: QueryParamType;
  setParam: (key: string, value: string, resetPage?: boolean) => void;
  onComplete: () => void;
  openNewModal: () => void;
}) => {
  return (
    <Stack
      spacing="4"
      direction={{ base: "column", md: "row" }}
      justify="space-between"
    >
      <HStack>
        <FormControl minW={{ md: "320px" }} id="search">
          <InputGroup size="sm">
            <FormLabel srOnly>Search</FormLabel>
            <InputRightElement pointerEvents="none" color="gray.400">
              <BsSearch />
            </InputRightElement>
            <Input
              rounded="base"
              type="search"
              value={params.text}
              placeholder="Search..."
              onChange={(e) => setParam("text", e.target.value, true)}
            />
          </InputGroup>
        </FormControl>
      </HStack>
      <ButtonGroup size="sm" variant="outline">
        <Button
          iconSpacing="1"
          onClick={() => openNewModal()}
          leftIcon={<RiAddFill fontSize="1.25em" />}
        >
          New Bot
        </Button>
      </ButtonGroup>
    </Stack>
  );
};