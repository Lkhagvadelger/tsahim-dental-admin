import { Pagination } from "@ui/components/Pagination";
import { useQueryParam } from "@ui/hooks/query-param";
import { Box, TableContent } from "@ui/index";
import { useRef } from "react";
import { BotInputType, useBots } from "../data/botHooks";
import { AddBotModal } from "./AddBotModal";
import { BotTableActions } from "./BotTableActions";

export const columns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Initial",
    accessor: "initialPrompt",
  },
];
export const BotList = () => {
  const tableName = "bots";
  const botModalRef = useRef() as {
    current: {
      onOpenEdit: (data: BotInputType | undefined | null) => void;
    };
  };

  const openNewModal = () => {
    botModalRef?.current?.onOpenEdit(null);
  };
  const { params, setParam } = useQueryParam({
    size: "10",
    page: "1",
    text: "",
  });
  const { data, refetch } = useBots(params);

  const openEditModal = (data: BotInputType) => {
    botModalRef?.current?.onOpenEdit(data);
  };
  return (
    <Box p={3}>
      <BotTableActions
        openNewModal={openNewModal}
        params={params}
        setParam={setParam}
        onComplete={() => {
          refetch();
        }}
      />
      <TableContent
      key={tableName}
        columns={columns}
        data={data?.data || []}
        editFunction={openEditModal}
        tableName={tableName}
      />
      <Pagination
        name={tableName}
        size={Number(params.size)}
        page={Number(params.page)}
        total={data?.total}
        pages={data?.pages}
        filtered={!!(params.text || params.country)}
        onChange={(page) => setParam("page", page.toString())}
      />
      <AddBotModal ref={botModalRef} refresh={refetch} />
    </Box>
  );
};
