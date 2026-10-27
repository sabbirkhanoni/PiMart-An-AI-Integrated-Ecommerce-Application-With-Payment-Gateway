import jwt from "jsonwebtoken";

const optionalAuth = async (request, response, next) => {
  try {
    const token =
      request.cookies.accessToken ||
      request?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    const secret = process.env.SECRET_KEY_ACCESS_TOKEN;
    if (!secret) {
      return next();
    }

    const decode = jwt.verify(token, secret);
    if (decode && decode.id) {
      request.userId = decode.id;
    }
    next();
  } catch {
    // If token is invalid or expired, gracefully continue as guest
    next();
  }
};

export default optionalAuth;
