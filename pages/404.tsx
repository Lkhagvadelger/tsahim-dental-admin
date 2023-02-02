import Error from "next/error";
import { SEO, AppLayout } from "@ui/index";

const NotFoundPage = () => {
  return (
    <AppLayout contentWidth="container.xl" title={""}>
      <SEO title={"404: Not found!"} />
      <Error statusCode={404} />
    </AppLayout>
  );
};

export default NotFoundPage;
