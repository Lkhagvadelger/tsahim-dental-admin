import { RegisterInputType } from "@lib/auth/data/authHooks";
import { useUsers } from "@lib/user/data/userHooks";
import { Pagination } from "@ui/components/Pagination";
import { useQueryParam } from "@ui/hooks/query-param";
import { Box, TableContent } from "@ui/index";
import { useRef } from "react";
import { AddUserModal } from "./AddUserModal";
import { UserDescription } from "./UserDescription";
import { UsersTableActions } from "./UserTableActions";

export const columns = [
  {
    Header: "Users",
    Cell(data: any) {
      return (
        <UserDescription
          email={data.email}
          phoneNumber={data.phoneNumber}
        />
      );
    },
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "PhoneNumber",
    accessor: "phoneNumber",
  },
  {
    Header: "Time zone",
    accessor: "timeZone",
  },
  {
    Header: "Auto Reply",
    accessor: "autoReply",
  },
  {
    Header: "Slack Post Id",
    accessor: "slackPostId",
  },
];
export const UserList = () => {
  const createModalRef = useRef() as {
    current: {
      onOpenEdit: (
        data: RegisterInputType | undefined | null,
        isPasswordUpdate?: boolean
      ) => void;
    };
  };
  const openNewModal = () => {
    createModalRef?.current?.onOpenEdit(null);
  };
  const { params, setParam } = useQueryParam({
    size: "10",
    page: "1",
    text: "",
  });
  const { data, refetch } = useUsers(params);

  const openEditModal = (
    data: RegisterInputType,
    isPassowrdUpdate?: boolean
  ) => {
    createModalRef?.current?.onOpenEdit(data, isPassowrdUpdate);
  };
  return (
    <Box p={3}>
     <UsersTableActions 
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
        editFunction={openEditModal}
        tableName={"users"}
      />
      <Pagination
        name={"Users"}
        size={Number(params.size)}
        page={Number(params.page)}
        total={data?.total}
        pages={data?.pages}
        filtered={!!(params.text || params.country)}
        onChange={(page) => setParam("page", page.toString())}
      />
      <AddUserModal ref={createModalRef} refresh={refetch} />
    </Box>
  );
};
