import { React, useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BsQuote } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "../reducers/postCommentsReducer";
import { useNavigate } from "react-router-dom";
import getErrorMsg from "../utils/getErrorMsg";
import { closeNavbar } from "../reducers/navbarReducer";
import axios from "axios";

function CreatePostForm({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/groups/allgroups"
        );
        console.log(response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError(error);
      }
    };

    fetchAllGroups();
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();
    const formData = {
      postTitle: title,
      postBody: description,
      group: selectedGroup,
    };
    try {
      setIsSubmitting(true);
      const newPostId = await dispatch(addNewPost(formData));
      console.log("New post ID:", newPostId);
      onClose();
      closeNavbar();
      navigate(`/comments/${encodeURIComponent(newPostId)}`, {
        state: { newPostId, title, description, selectedGroup },
      });
    } catch (error) {
      setIsSubmitting(false);
      setError(getErrorMsg(error));
      console.error(error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".create-post-form-container")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <form onSubmit={handleAddPost}>
      <section className="create-post-form-wrapper">
        <div className="create-post-form-overlay"></div>
        <div className="create-post-form-container">
          <div className="post-form-title-wrapper">
            <label htmlFor="post-title" className="post-form-title">
              <BsQuote className="post-form-title-icon" />
              عنوان
            </label>
            <input
              type="text"
              placeholder="عنوان را وارد کنید"
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="post-form-description-wrapper">
            <label htmlFor="post-description" className="post-form-description">
              <HiOutlineMenuAlt3 className="post-form-description-icon" />
              توضیحات
            </label>
            <textarea
              type="text"
              placeholder="توضیحات را وارد کنید"
              id="post-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="post-form-group-wrapper">
            <label htmlFor="post-group" className="post-form-group">
              <FaUsers className="post-form-group-icon" />
              گروه
            </label>
            <select
              id="post-group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">گروه را انتخاب کنید</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>
          <div className="create-post-form-btn-container">
            <button
              type="submit"
              className="create-post-form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ارسال..." : "ثبت"}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}

export default CreatePostForm;
