import {
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpoint,
  useColorModeValue,
  VStack,
} from "@ui/index";
import { ReactNode } from "react";
import router from "next/router";
type Column = {
  Cell?: (data: any) => JSX.Element;
  Header?: ReactNode;
  accessor?: string;
  hideInMobile?: boolean;
};

type Props = {
  tableName?: string;
  columns: Column[];
  data: any[];
  editFunction: (data: any) => void;
};

export const TableContent = ({
  data,
  columns,
  editFunction,
  tableName,
}: Props) => {
  const bp = useBreakpoint();

  return (
    <Table my="8" borderWidth="1px" fontSize="sm" key={tableName}>
      <Thead bg={"#f7fafc"}>
        <Tr key={1}>
          {columns.map((column, index) => {
            return (
              <>
                {bp !== "sm" && bp !== "base" && (
                  <Th key={index} p={3}>
                    {column.Header}
                  </Th>
                )}
              </>
            );
          })}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => (
          <Tr key={index}>
            {columns.map((column, cindex) => {
              const cell = column.accessor
                ? row[column.accessor as keyof typeof row]
                : row;
              const element = column.Cell?.(cell) ?? cell;

              return (
                <>
                  {bp !== "sm" && bp !== "base" && (
                    <Td key={cindex} borderColor={"gray.50"} p={1}>
                      {element}
                    </Td>
                  )}
                </>
              );
            })}
            <Td textAlign="right" borderColor={"gray.50"} w={"50px"} p={1}>
              <HStack gap={2}>
                {tableName == "conversation" && (
                  <VStack>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      onClick={() => {
                        router.push(`api/conversation/${row.id}`);
                      }}
                    >
                      Json detail
                    </Button>
                  </VStack>
                )}
                {tableName == "bots" && (
                  <VStack>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      onClick={() => {
                        editFunction(row);
                      }}
                    >
                      Edit
                    </Button>
                  </VStack>
                )} {tableName == "users" && (
                  <VStack>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      onClick={() => {
                        editFunction(row);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      onClick={() => {
                        router.push(`api/users/${row.id}/detail`);
                      }}
                    >
                      Detail
                    </Button>
                  </VStack>
                )}
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
