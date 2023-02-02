
import { useAuth, withRequireLogin } from "@lib/auth/ui";
import { UserRole } from "@prisma/client";
import NotFoundPage from "pages/404";
import { AdminProvider } from "@lib/admin/ui/layout/AdminUIContext";
import { BotList } from "@lib/bot/ui";

const BotPage = () => {
  const { user } = useAuth();
  return !user || user.role != UserRole.ADMIN ? (
    <NotFoundPage />
  ) : (
    <AdminProvider selectedNav="bot">
      <BotList />
    </AdminProvider>
  );
};

export default withRequireLogin(BotPage);
