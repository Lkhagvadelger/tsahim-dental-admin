import { AppLayout, Tabs, TabList, Tab, TabPanels, TabPanel } from "@ui/index";
import { useAuth, withRequireLogin } from "@lib/auth/ui"; 
import { UserRole } from "@prisma/client";
import NotFoundPage from "pages/404";
import { AdminProvider } from "@lib/admin/ui/layout/AdminUIContext";
import { UserList } from "@lib/user/ui";

const AdminPage = () => {
  const { user } = useAuth();
  return !user || user.role != UserRole.ADMIN ? (
    <NotFoundPage />
  ) : (
    <AdminProvider selectedNav="users">
      <UserList/>
    </AdminProvider>
  );
};

export default withRequireLogin(AdminPage);
