import axios from "axios";
import { Config } from "./config";
import { setServerStatus } from "../store/service.store";
import { getAccessToken } from "../store/profile.store";
import dayjs from "dayjs";
import { data } from "react-router-dom";

export const request = (url = "", method = "get", data = {}) => {
  console.log("access_token", getAccessToken());
  var access_token = getAccessToken();
  // in react
  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    // check if param data is FormData
    headers = { "Content-Type": "multipart/form-data" };
  }
  var param_query = "?";
  if (method == "get" && data instanceof Object) {
    Object.keys(data).map((key, index) => {
      if (data[key] != "" && data[key] != null) {
        param_query += "&" + key + "=" + data[key];
      }
    });
  }
  return axios({
    url: Config.base_url + url + param_query,
    method: method,
    data: data,
    headers: {
      ...headers,
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

// formart data client and server
export const formatDateClient = (date, format = "DD-MM-YYYY") => {
  if(date) return dayjs(date).format(format);
  return null;
};

export const formatDateServer = (date, format = "YYYY-MM-DD") => {
  if(date) return dayjs(date).format(format);
  return null;
};
