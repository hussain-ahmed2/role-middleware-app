// Define allowed roles for each path
const ROLE = {
  "/admin": ["admin:get", "admin:post", "admin:put", "admin:delete"],
  "/users": ["admin:get", "admin:post", "admin:put", "admin:delete"],
  "/profile": [
    "user:get",
    "user:post",
    "user:put",
    "user:delete",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
  "/profile/credentials": [
    "user:get",
    "user:post",
    "user:put",
    "user:delete",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
  "/profile/avatar": [
    "user:get",
    "user:post",
    "user:put",
    "user:delete",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
  "/profile/password": [
    "user:get",
    "user:post",
    "user:put",
    "user:delete",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
  "/products": [
    "public:get",
    "user:get",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
  "/products/:id": [
    "public:get",
    "user:get",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
  "/cart": [
    "user:get",
    "user:post",
    "user:put",
    "user:delete",
    "admin:get",
    "admin:post",
    "admin:put",
    "admin:delete",
  ],
};

// Function to validate roles
const validateRole = (path, role, method) => {
  const allowedRoles = ROLE[path].includes(`${role}:${method}`);
  return allowedRoles;
};

// Function to validate path
const validatePath = (path) => {
  return Object.keys(ROLE).find((url) => {
    if (url === "/products/:id") {
      const match = /^\/products\/\w+$/.test(path);
      return match ? url : false;
    } else {
      return path === url ? url : false;
    }
  });
};

// Role middleware
export const roleMiddleWare = async (req, res, next) => {
  try {
    const path = validatePath(req.path);
    if (!path) return res.status(404).json({ message: "Path not found" });

    const role = req?.user?.role || "public";

    // Check if the path has defined roles
    const allowedRoles = validateRole(path, role, req.method.toLowerCase());

    // Verify if the user's role is allowed for the path
    if (!allowedRoles) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    // Handle errors and respond with a server error message
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
