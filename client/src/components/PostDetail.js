import { React, useEffect, useState } from "react";
import Comment from "./Comment";
import user from "../assets/user.webp";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  FaShareSquare,
  FaRegCommentAlt,
  FaRegBookmark,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getPostComments } from "../reducers/postCommentsReducer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function PostDetail() {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.postComments);
  console.log(postInfo);
  const { state } = useLocation();
  const postId = state ? state.newPostId : null;
  console.log(postId);

  useEffect(() => {
    const getpostDetails = async () => {
      try {
        const postDetails = await dispatch(getPostComments(postId));
      } catch (error) {
        console.error(error);
      }
    };
    getpostDetails();
  }, [postId]);

  return (
    <>
      <section className="post-detail-upper-wrapper">
        <header className="post-detail-header">
          <div className="post-detail-header-right">
            <img src={user} alt="" className="user-profile-image" />
            <Link className="author" to="u/placeholder">
              {postInfo.author.username}
            </Link>
            <p className="date-posted">(2 روز قبل)</p>
          </div>
          <div className="post-detail-header-left">
            <HiOutlineUserGroup className="post-detail-group-icon" />
            <span className="post-detail-group-posted">
              {postInfo.group.groupName}
            </span>
          </div>
        </header>
        <article className="post-detail-body">
          <h4 className="post-detail-title">{postInfo.postTitle}</h4>
          <p className="post-detail-body">{postInfo.postBody}</p>
        </article>
        <footer className="post-detail-footer">
          <div className="like-icon-wrapper">
            <span>
              <FaRegThumbsDown className="dislike-btn" />
            </span>
            <span>
              <p className="like-count">{postInfo.pointsCount}</p>
            </span>
            <span>
              <FaRegThumbsUp className="like-btn" />
            </span>
          </div>
          <div className="comment-icon-wrapper">
            <span>
              <FaRegCommentAlt className="comment-icon" />
            </span>
            <span>
              <p className="comment-count">{postInfo.commentCount}</p>
            </span>
          </div>
          <div className="misc-icons-wrapper">
            <FaShareSquare className="share-btn" />
            <FaRegBookmark className="archive-btn" />
          </div>
        </footer>
      </section>

      <section className="post-detail-lower-wrapper">
        <p className="post-comment-intro">نظر شما چیه؟</p>
        <textarea
          className="post-detail-comment-area"
          placeholder="نظر خود را تایپ کنید..."
        ></textarea>

        <div className="comment-btn-container">
          <button type="submit" className="comment-btn">
            ارسال
          </button>
        </div>
      </section>
      <Comment />
      <Comment />
      <Comment />
    </>
  );
}

export default PostDetail;
