"use client";

import axios from "axios";

import instance from "@/configs/axios.instance";
import { toast } from "react-toastify";
const { useState } = require("react");
function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}
const useFetch = ({ url, method, body, onSuccess, onFailed }) => {
  const [errors, setErrors] = useState(null);

  async function sendRequest(e) {
    try {
      let res;
      // id = toast.loading("Please wait...");
      if ("method" === "get") {
        res = await instance[method](url);
      } else {
        res = await instance[method](url, body);
      }
      if (onSuccess || isFunction(onSuccess)) {
        onSuccess(res.data);
      }
      return res.response;
    } catch (error) {
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);

        if (onFailed || isFunction(onFailed)) {
          return onFailed(error);
        }
        error.response.data.errors.map((err) => {
          toast.error(err.message);
        });
      } else {
        setErrors(error);
      }
    }
  }
  async function request() {
    if ("method" === "get") {
      return instance[method](url);
    } else {
      return await instance[method](url, body);
    }
  }
  return { sendRequest, request, errors };
};
export default useFetch;
