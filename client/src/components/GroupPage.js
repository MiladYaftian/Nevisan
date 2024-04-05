import React from "react";
import PostContainer from "./PostContainer";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaRegUser, FaRegCalendarCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function GroupPage() {
  const { state } = useLocation();
  console.log(state);
  return (
    <section className="group-page-top-card">
      <header className="group-page-header">
        <div className="group-page-title">
          <HiOutlineUserGroup className="group-page-icon" />
          <span className="group-page-title">{state.groupTitle}</span>
        </div>
        <button className="group-page-join-btn" type="submit">
          عضویت
        </button>
      </header>
      <p className="group-page-description">
        {state.groupDescription.substring(0, 200)}
      </p>
      <footer className="group-page-footer">
        <div className="group-page-sub-count-wrapper">
          <FaRegUser className="group-page-sub-count-icon" />
          <span className="group-page-sub-count">256 عضو</span>
        </div>
        <div className="group-page-creation-date-wrapper">
          <FaRegCalendarCheck className="group-page-creation-date-icon" />
          <span className="group-page-creation-date">1402/12/29</span>
        </div>
      </footer>
    </section>
  );
}

export default GroupPage;
