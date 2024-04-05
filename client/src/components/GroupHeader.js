import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaRegUser, FaRegCalendarCheck } from "react-icons/fa";

function GroupHeader({
  groupTitle,
  groupDescription,
  subscriberCount,
  createdAt,
}) {
  return (
    <section className="group-page-top-card">
      <header className="group-page-header">
        <div className="group-page-title">
          <HiOutlineUserGroup className="group-page-icon" />
          <span className="group-page-title">{groupTitle}</span>
        </div>
        <button className="group-page-join-btn" type="submit">
          عضویت
        </button>
      </header>
      <p className="group-page-description">{groupDescription}</p>
      <footer className="group-page-footer">
        <div className="group-page-sub-count-wrapper">
          <FaRegUser className="group-page-sub-count-icon" />
          <span className="group-page-sub-count">{subscriberCount} عضو</span>
        </div>
        <div className="group-page-creation-date-wrapper">
          <FaRegCalendarCheck className="group-page-creation-date-icon" />
          <span className="group-page-creation-date">{createdAt}</span>
        </div>
      </footer>
    </section>
  );
}

export default GroupHeader;
