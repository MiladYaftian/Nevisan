import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import user from "../assets/user.webp";
import {
  FaShareSquare,
  FaRegCommentAlt,
  FaRegBookmark,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function PostContainer({
  author,
  groupName,
  postTitle,
  postDescription,
  pointsCount,
  commentCount,
  createdAt,
}) {
  return (
    <section className="post-wrapper">
      <article className="post-header">
        <div className="user-section">
          <img
            className="user-profile-image"
            src={user}
            alt="تصویر پروفایل کاربر"
          />
          <Link className="author" to="u/placeholder">
            {author}
          </Link>
        </div>
        <div className="group-section">
          <HiOutlineUserGroup className="group-icon" />
          <Link className="group-name" to="g/someGroup">
            {" "}
            {groupName}
          </Link>
        </div>
      </article>
      <article className="post-title-wrapper">
        <h3 className="post-title">{postTitle}</h3>
        <p className="post-date">{createdAt}</p>
      </article>

      <article className="post-description-wrapper">
        <p className="post-description">{postDescription}</p>
      </article>

      <article className="post-footer-wrapper">
        <div className="like-icon-wrapper">
          <span>
            <FaRegThumbsDown className="dislike-btn" />
          </span>
          <span>
            <p className="like-count">{pointsCount}</p>
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
            <p className="comment-count">{commentCount}</p>
          </span>
        </div>
        <div className="misc-icons-wrapper">
          <FaShareSquare className="share-btn" />
          <FaRegBookmark className="archive-btn" />
        </div>
      </article>
    </section>
  );
}

export default PostContainer;
