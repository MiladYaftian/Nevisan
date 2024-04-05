import React from "react";
import PostContainer from "./PostContainer";
import testData from "../assets/testData";

function HomePage() {
  return (
    <div>
      {testData.map((post) => (
        <PostContainer
          key={post.id}
          author={post.author}
          groupName={post.groupName}
          postTitle={post.postTitle}
          postDescription={post.postDescription}
          pointsCount={post.pointsCount}
          commentCount={post.commentCount}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}

export default HomePage;
