import { AppError } from "@util/errors";

export const Error = ({ error }: { error: AppError }) => {
  return (
    <div>
      <h1>Uncaught Error:</h1>
      <p>{error.message}</p>
    </div>
  );
};
