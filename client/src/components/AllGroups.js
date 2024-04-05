import { React, useState, useEffect } from "react";
import moment from "moment-jalaali";
import axios from "axios";
import GroupHeader from "./GroupHeader";
function AllGroups() {
  const [groups, setGroups] = useState([]);

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
      }
    };

    fetchAllGroups();
  }, []);

  const formatCreatedAt = (createdAt) => {
    return moment(createdAt, "YYYY-MM-DDTHH:mm:ss.SSS").format("jYYYY/jMM/jDD");
  };
  return (
    <div>
      {groups.map((g) => (
        <GroupHeader
          key={g.id}
          groupTitle={g.groupName}
          groupDescription={g.groupDescription}
          subscriberCount={g.subscriberCount}
          createdAt={formatCreatedAt(g.createdAt)}
        />
      ))}
    </div>
  );
}

export default AllGroups;
