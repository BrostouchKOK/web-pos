import axios from "axios";
import { Config } from "./config";
import { setServerStatus } from "../store/service.store";
import { getAccessToken } from "../store/profile.store";

export const request = (url = "", method = "get", data) => {
  console.log("access_token", getAccessToken());
  var access_token = getAccessToken();
  return axios({
    url: Config.base_url + url,
    method: method,
    data: data,
    headers: {
      Authorization: "Bearer " + access_token, // syntax
    },
  })
    .then((res) => {
      setServerStatus("200");
      return res.data;
    })
    .catch((err) => {
      var response = err.response;
      if (response) {
        var status = response.status;
        if (status == 401) {
          status = 403;
        }
        setServerStatus(status);
      } else if (err.code == "ERR_NETWORK") {
        setServerStatus("error");
      }
      console.log(err);
      return false;
    });
};
