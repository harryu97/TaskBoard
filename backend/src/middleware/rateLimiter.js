import rateLimit from "../config/upstash.js"
const rateLimiter = async (req, res, next) => {
  //per ueser-> jon but we dont have authen 
  // this code can cause everyone block. we need identifier
  try {
    const { success } = await rateLimit.limit("my-limit-key");
    if (!success) {
      return res.status(429).json({ message: "Too many request" });
    }
    next();
  } catch (error) {
    console.log("Error at ratelimit", error);
    next(error)
  }
}
export default rateLimiter 
