import { useAuth, withRequireLogin } from "@lib/auth/ui";
import { UserRole } from "@prisma/client";
import NotFoundPage from "pages/404";
import { AdminProvider } from "@lib/admin/ui/layout/AdminUIContext";
import { useRouter } from "next/router";
import { ChangePasswordPage } from "@lib/profile/ui";

const AdminPage = () => {
  const router = useRouter();
  const type = router.query.type as string;
  const { user } = useAuth();
  return !user || user.role != UserRole.ADMIN ? (
    <NotFoundPage />
  ) : (
    <AdminProvider selectedNav="account">
      <ChangePasswordPage />
    </AdminProvider>
  );
};

export default withRequireLogin(AdminPage);
