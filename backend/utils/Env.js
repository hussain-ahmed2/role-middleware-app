class Env {
  static PORT = process.env.PORT;
  static JWT_SECRET = process.env.JWT_SECRET;
  static MONGODB_URI = process.env.MONGODB_URI;
}

export default Env;
