import { Box, TableContent, TablePagination } from "@ui/index";
import { useRef } from "react";
import { useQueryParam } from "@ui/hooks/query-param";
import { Pagination } from "@ui/components/Pagination";
import {
  ConversationInputType,
  useConversations,
} from "../data/conversationHooks";
import { ConversationTableActions } from "./ConversationTableActions";
import { MessageInputType } from "@lib/messages/data/messagesHooks";
import { AddConversationModal } from "./AddConversationModal";
import { NextQuestionModal } from "./NextQuestionForm";

export const columns = [
  {
    Header: "User",
    accessor: "userId",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Prompt",
    accessor: "prompt",
  },
];
export const ConversationList = () => {
  const createConversationModalRef = useRef() as {
    current: {
      onOpenEdit: (data: ConversationInputType | undefined | null) => void;
    };
  };
  const createMessageModalRef = useRef() as {
    current: {
      onOpenEdit: (
        data: MessageInputType | undefined | null,
      ) => void;
    };
  };
  const openNewModal = () => {
    createConversationModalRef?.current?.onOpenEdit(null);
  };
  const { params, setParam } = useQueryParam({
    size: "10",
    page: "1",
    text: "",
  });
  const { data, refetch } = useConversations(params);

  const openMessageModal = (data: MessageInputType) => {
    createMessageModalRef?.current?.onOpenEdit(data);
  };
  const openEditModal = (data: ConversationInputType) => {
    createConversationModalRef?.current?.onOpenEdit(data);
  };
  return (
    <Box p={3}>
      <ConversationTableActions
        openNewModal={openNewModal}
        params={params}
        setParam={setParam}
        onComplete={() => {
          refetch();
        }}
      />
      <TableContent
        columns={columns}
        data={data?.data || []}
        editFunction={openMessageModal}
        tableName={"conversation"}
      />
      <Pagination
        name={"conversation"}
        size={Number(params.size)}
        page={Number(params.page)}
        total={data?.total}
        pages={data?.pages}
        filtered={!!(params.text || params.country)}
        onChange={(page) => setParam("page", page.toString())}
      />
      <AddConversationModal ref={createConversationModalRef} refresh={refetch} />
      <NextQuestionModal ref={createMessageModalRef} refresh={refetch} />
    </Box>
  );
};
