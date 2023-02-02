import { Button, ButtonGroup, Flex, Text, useColorModeValue } from "@ui/index";

type Props = {
  dataName: string;
  data: any[];
};

export const TablePagination = ({ dataName, data }: Props) => {
  return (
    <Flex align="center" justify="space-between">
      <Text color={useColorModeValue("gray.600", "gray.400")} size="sm">
       Нийт {data.length} {dataName} байна
      </Text>
      <ButtonGroup variant="outline" size="sm">
        <Button as="a" rel="prev">
          Өмнөх
        </Button>
        <Button as="a" rel="next">
          Дараах
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
