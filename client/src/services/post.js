import axios from "axios";
import token from "./auth";
import backendUrl from "../backendUrl";
import axiosInstance from "./axiosInstance";

const baseUrl = `${backendUrl}/api/posts`;

const getPosts = async (sortBy, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/?sortby=${sortBy}&limit=${limit}&page=${page}`
  );
  return response.data;
};

const getPostAndComments = async (postId) => {
  const response = await axios.get(`${baseUrl}/${postId}/comments`);
  console.log("post and comments fetched successfully", response.data);
  return response.data;
};

const getSubscribedPosts = async (limit, page) => {
  const response = await axiosInstance.get(
    `${baseUrl}/subscribed/?limit=${limit}&page=${page}`
  );
  return response.data;
};

const createPost = async (postObj) => {
  const response = await axiosInstance.post(baseUrl, postObj);
  return response.data;
};

const getSearchedPosts = async (query, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/search?query=${query}&limit=${limit}&page=${page}`
  );
  console.log("success", response.data);
  return response.data;
};

const updatePost = async (postId, dataObj) => {
  const response = await axiosInstance.patch(`${baseUrl}/${postId}`, dataObj);
  console.log("success", response.data);
  return response.data;
};

const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`${baseUrl}/${postId}`);
  console.log("success", response.data);
  return response.data;
};

const likePost = async (postId) => {
  const response = await axiosInstance.post(`${baseUrl}/${postId}/like`, null);
  console.log("success", response.data);
  return response.data;
};

const dislikePost = async (postId) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/dislike`,
    null
  );
  console.log("success", response.data);
  return response.data;
};

const postComment = async (postId, commentObj) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/comment`,
    commentObj
  );
  console.log("success", response.data);
  return response.data;
};

const updateComment = async (postId, commentId, commentObj) => {
  const response = await axiosInstance.patch(
    `${baseUrl}/${postId}/comment/${commentId}`,
    commentObj
  );
  console.log("success", response.data);
  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const response = await axiosInstance.delete(
    `${baseUrl}/${postId}/comment/${commentId}`
  );
  console.log("success", response.data);
  return response.data;
};

const likeComment = async (postId, commentId) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/comment/${commentId}/like`,
    null
  );
  console.log("success", response.data);
  return response.data;
};
const dislikeComment = async (postId, commentId) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/comment/${commentId}/dislike`,
    null
  );
  console.log("success", response.data);
  return response.data;
};

const postReply = async (postId, commentId, replyObj) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/comment/${commentId}/reply`,
    replyObj
  );
  console.log("success", response.data);
  return response.data;
};

const updateReply = async (postId, commentId, replyId, replyObj) => {
  const response = await axiosInstance.patch(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}`,
    replyObj
  );
  console.log("success", response.data);
  return response.data;
};

const likeReply = async (postId, commentId, replyId) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}/like`,
    null
  );
  console.log("success", response.data);
  return response.data;
};
const dislikeReply = async (postId, commentId, replyId) => {
  const response = await axiosInstance.post(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}/dislike`,
    null
  );
  console.log("success", response.data);
  return response.data;
};

const deleteReply = async (postId, commentId, replyId) => {
  const response = await axiosInstance.delete(
    `${baseUrl}/${postId}/comment/${commentId}/reply/${replyId}`
  );
  console.log("success", response.data);
  return response.data;
};

const postService = {
  getPosts,
  getSubscribedPosts,
  getPostAndComments,
  createPost,
  getSearchedPosts,
  updatePost,
  deletePost,
  postComment,
  updateComment,
  deleteComment,
  postReply,
  updateReply,
  deleteReply,
  likePost,
  dislikePost,
  likeComment,
  dislikeComment,
  likeReply,
  dislikeReply,
};

export default postService;
