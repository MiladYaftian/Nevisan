import { Routes, Route } from "react-router-dom";
import UserPage from "./components/UserPage";
import PostDetail from "./components/PostDetail";
import GroupPage from "./components/GroupPage";
import NotFound from "./components/NotFound";
import AllGroups from "./components/AllGroups";
import HomePage from "./components/HomePage";

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/comments/:id" element={<PostDetail />} />
      <Route path="/u/:username" element={<UserPage />} />
      <Route path="/g/:groupName" element={<GroupPage />} />
      <Route path="/all-groups" element={<AllGroups />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SiteRoutes;
