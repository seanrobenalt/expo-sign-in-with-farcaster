import { callApi } from "./base";

export const apiCreateUser = async (body) => {
  return callApi("/users", {
    method: "POST",
    body,
  });
};

export const apiUpdateUser = async (fid, body) => {
  return callApi(`/users/update/${fid}`, {
    method: "PUT",
    body,
  });
};
