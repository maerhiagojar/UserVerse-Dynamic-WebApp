
// API functions for fetching data from JSON Placeholder

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch user by ID
export const fetchUserById = async (userId: number) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Fetch all posts
export const fetchAllPosts = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Fetch posts by user ID
export const fetchPostsByUserId = async (userId: number) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};

// Fetch post by ID
export const fetchPostById = async (postId: number) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error;
  }
};

// Fetch comments by post ID
export const fetchCommentsByPostId = async (postId: number) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

// Fetch all comments
export const fetchAllComments = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all comments:', error);
    throw error;
  }
};

// Get statistics for admin dashboard
export const fetchStatistics = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchAllPosts(),
      fetchAllComments(),
    ]);
    
    return {
      userCount: users.length,
      postCount: posts.length,
      commentCount: comments.length,
      users,
      posts,
      comments,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
