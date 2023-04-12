import { AppLayout, Tabs, TabList, Tab, TabPanels, TabPanel } from "@ui/index";
import { useAuth, withRequireLogin } from "@lib/auth/ui";
import NotFoundPage from "pages/404";
import { AdminProvider } from "@lib/admin/ui/layout/AdminUIContext";
import { UserList } from "@lib/user/ui";
import { useRouter } from "next/router";

const AdminPage = () => {
  const router = useRouter();
  const type = router.query.type as string;
  const { user } = useAuth();
  return !user ? (
    <NotFoundPage />
  ) : (
    <AdminProvider selectedNav={type}>
      <UserList />
    </AdminProvider>
  );
};

export default withRequireLogin(AdminPage);
