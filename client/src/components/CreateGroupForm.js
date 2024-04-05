import React, { useState, useEffect } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BsQuote } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewGroup } from "../reducers/groupReducer";
import getErrorMsg from "../utils/getErrorMsg";
import * as yup from "yup";

const validationSchemaGroup = yup.object({
  groupName: yup
    .string()
    .required("نام گروه را وارد کنید")
    .min(3, "نام گروه باید حداقل 3 نویسه باشد")
    .max(20, "نام گروه نباید بیشتر از 20 نویسه باشد"),
  groupDescription: yup
    .string()
    .required("توضیحات گروه را وارد کنید")
    .min(3, "توضیحات گروه باید حداقل 3 نویسه باشد")
    .max(100, "توضیحات گروه نباید بیشتر از 20 نویسه باشد"),
});

function CreateGroupForm({ isOpen, onClose, closeNavbar }) {
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    console.log("Handling group creation...");
    try {
      console.log("Submitting group creation form...");
      setIsSubmitting(true);
      await dispatch(
        createNewGroup({ groupName: groupTitle, groupDescription })
      );
      setIsSubmitting(false);
      onClose();
      closeNavbar();
      navigate(`/g/${encodeURIComponent(groupTitle)}`, {
        state: { groupDescription, groupTitle },
      });
    } catch (error) {
      console.error("Group creation failed:", error);
      setIsSubmitting(false);
      setError(getErrorMsg(error));
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
    <form onSubmit={handleCreateGroup}>
      <section className="create-post-form-wrapper">
        <div className="create-post-form-overlay"></div>
        <div className="create-post-form-container">
          <div className="post-form-title-wrapper">
            <label htmlFor="groupTitle" className="post-form-title">
              <BsQuote className="post-form-title-icon" />
              عنوان
            </label>
            <input
              type="text"
              className="post-form-title"
              placeholder="عنوان را وارد کنید"
              id="groupTitle"
              name="groupTitle"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
            />
            {error && error.groupTitle && (
              <div className="error-message">{error.groupTitle}</div>
            )}
          </div>
          <div className="post-form-description-wrapper">
            <label htmlFor="groupDescription" className="post-form-description">
              <HiOutlineMenuAlt3 className="post-form-description-icon" />
              توضیحات
            </label>
            <textarea
              className="post-form-description"
              placeholder="توضیحات را وارد کنید"
              id="groupDescription"
              name="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
            {error && error.groupDescription && (
              <div className="error-message">{error.groupDescription}</div>
            )}
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

export default CreateGroupForm;
