import { CustomServerError } from "./server-error";

export const isCustomServerError = (
  error: unknown
): error is CustomServerError => {
  if (typeof error === "object" && error !== null) {
    return (error as CustomServerError).isCustomError === true;
  }

  return false;
};

export const serverErrorHandler = (error: unknown) => {
  let name = "UnknownError";
  let message = "알수없는 에러가 발생했습니다.";
  let status = 499;

  if (isCustomServerError(error)) {
    name = error.name;
    message = error.message;
    status = error.status;
  }

  return { name, message, status };
};
