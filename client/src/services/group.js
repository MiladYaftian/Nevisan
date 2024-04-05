import axios from "axios";
import token from "./auth";
import backendUrl from "../backendUrl";
import axiosInstance from "./axiosInstance";

const setConfig = () => {
  return {
    headers: {
      "x-auth-token": token,
    },
  };
};

const baseUrl = `${backendUrl}/api/groups`;

const getAllGroups = async () => {
  const response = await axios.get(`${baseUrl}/allgroups`);
  console.log(response.data);
  return response.data;
};

const createGroup = async (dataObject) => {
  try {
    console.log("Sending request to create group...");
    const response = await axiosInstance.post(`${baseUrl}`, dataObject);
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

const getGroup = async (groupName) => {
  const response = await axios.get(`${baseUrl}/${groupName}`);
  return response.data;
};

const getGroupPosts = async (groupName) => {
  const response = await axios.get(`${baseUrl}/${groupName}`);
  console.log("data fetched successfully", response.data);
  return response.data;
};

const getTopGroups = async () => {
  const response = await axios.get(`${baseUrl}/top10`);
  console.log("top groups fetched successfully", response.data);
  return response.data;
};

const subscribeToGroup = async (id) => {
  const response = await axios.post(
    `${baseUrl}/${id}/subscribe`,
    null,
    setConfig()
  );
  console.log("subscribed to group successfully", response.data);
  return response.data;
};

const editGroupDescription = async (groupId, descObj) => {
  const response = await axios.patch(
    `${baseUrl}/${groupId}`,
    descObj,
    setConfig()
  );
  console.log("group description edited successfully", response.data);
  return response.data;
};

const groupService = {
  getAllGroups,
  createGroup,
  getGroupPosts,
  getTopGroups,
  subscribeToGroup,
  editGroupDescription,
  getGroup,
};

export default groupService;
