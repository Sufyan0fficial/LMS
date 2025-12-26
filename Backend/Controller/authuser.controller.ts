import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import { IUser, userModel } from "../Model/user.model.js";
import { customError } from "../Utils/customError.js";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../Utils/sendActivationEmail.js";
import { fileURLToPath } from "url";
import { SendCookie } from "../Utils/jwt.js";
import { CookieParseOptions } from "cookie-parser";
import { redisClient } from "../Redis/init.redis.js";
import cloudinary from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const User_Registration = AsyncWrapper(async (req, res, next) => {
  const { name, email, password: pass } = req.body;
  const isAlreadyRegistered = await userModel.findOne({ email });
  if (isAlreadyRegistered) {
    return next(customError(400, "User already registered against this email"));
  }
  const bcryptedPassword = bcrypt.hashSync(pass, 10);
  const user = {
    name,
    email,
    password: bcryptedPassword,
  };
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const authToken = jwt.sign(
    { user: user, verificationCode: verificationCode },
    process.env.JWT_SECRETS as Secret,
    {
      expiresIn: "5m",
    }
  );
  const verificationEmail = await ejs.renderFile(
    path.join(__dirname, "../Templates/verficationEmail.ejs"),
    {
      logoUrl: "",
      companyName: "Sufyan LMS",
      code: verificationCode,
      supportEmail: "computer388unofficial@gmail.com",
      subject: "Activate Your Account",
      userName: name,
      companyAddress: "Township A2, Block 4, Lahore, Paskistan",
      companyPhone: "0317 0652733",
    }
  );

  res.status(200).json({
    message: "Activation email sent to verify your account",
    success: true,
    authToken: authToken,
  });

  await sendMail({
    to: email,
    subject: "Activate Your Account",
    html: verificationEmail,
  }).catch((err) => console.error("Email send failed:", err));
});

export const Activate_User = AsyncWrapper(async (req, res, next) => {
  const { verificationCode, authToken } = req.body;
  const newUser = jwt.verify(authToken, process.env.JWT_SECRETS as Secret) as {
    user: any;
    verificationCode: string;
  };
  if (newUser.verificationCode !== verificationCode) {
    return next(
      customError(400, "User verification Failed ! Please enter correct code")
    );
  }
  const { user } = newUser;
  console.log("user detail is", user);
  const registerNewUser = await userModel.create(user);
  return res.status(200).json({
    message: "Account created successfully",
    success: true,
  });
});

export const Login_User = AsyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const RegisteredUser = await userModel.findOne({ email });
  if (!RegisteredUser) {
    return next(
      customError(400, "Invalid Credentials ! Please enter correct email")
    );
  }
  const validatePassword = bcrypt.compareSync(
    password,
    RegisteredUser?.password
  );
  if (!validatePassword) {
    return next(
      customError(400, "Invalid Credentials ! Please enter correct password")
    );
  }

  SendCookie(RegisteredUser, 200, res);
});

export const Logout_User = AsyncWrapper(async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  redisClient.del(req.user?._id);
  return res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
});

export const Refresh_AccessToken = AsyncWrapper(async (req, res, next) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token) {
    return next(customError(403, "Session Expired ! Please login again"));
  }
  const user = jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN as string
  ) as { id: string };
  if (!user?.id) {
    return next(customError(403, "Session Expired ! Please login again"));
  }
  const userData = (await redisClient.get(user?.id)) as string;

  const ParsedUserData = JSON.parse(userData);
  SendCookie(ParsedUserData, 200, res, true);
});

export const User_Profile = AsyncWrapper(async (req, res, next) => {
  const userData = req?.user;
  if (!userData?._id) {
    return next(customError(400, "Failed to get User Data"));
  }
  return res.status(200).json({
    success: true,
    data: userData,
  });
});

export const Update_Profile = AsyncWrapper(async (req, res, next) => {
  const UserId = req.user?._id;
  const requestedData = req.body;
  const name = requestedData?.name;
  const email = requestedData?.email;
  const isEmailAlreadyRegistered = await userModel.findOne({ email });
  if (isEmailAlreadyRegistered) {
    return next(customError(400, "Requested email already exist."));
  }
  const updatedData = await userModel.findByIdAndUpdate(UserId, requestedData, {
    new: true,
    runValidators: true,
  });
  redisClient.set(`${UserId}`, JSON.stringify(updatedData));
  return res.status(201).json({
    success: true,
    data: updatedData,
    message: "Profile Updated Successfully",
  });
});

export const update_Password = AsyncWrapper(async (req, res, next) => {
  const userId = req.user?._id;
  const hashedPassword = req.user?.password;
  const oldPassword = req.body?.oldPassword;
  const newPassword = req.body?.newPassword;
  const verifyPassword = bcrypt.compareSync(oldPassword, hashedPassword);
  if (!verifyPassword) {
    return next(customError(400, "Failed to verify Old Password"));
  }
  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  const passwordUpdatedUser = await userModel.findByIdAndUpdate(
    userId,
    { password: hashedNewPassword },
    { new: true, runValidators: true }
  );
  redisClient.set(`${userId}`, JSON.stringify(passwordUpdatedUser));
  return res.status(201).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const Update_Avatar = AsyncWrapper(async (req, res, next) => {
  const avatar = req.body?.avatar;
  const user = req.user;

  const uplaodAvatar = async (img: any):Promise<{userData:IUser|null}> => {
    const MyCloud = await cloudinary.v2.uploader.upload(img, {
      folder: "avatars",
      width: 150,
    });
    const PublicId = MyCloud?.public_id
    const Url = MyCloud.secure_url
    const AvatarData = {
      public_id : PublicId,
      url : Url
    }
    const updatedUser = {...user,avatar:AvatarData}
    redisClient.set(`${user?._id}`,JSON.stringify(updatedUser))
    const updatedUserData:IUser|null = await userModel.findByIdAndUpdate(user?._id,updatedUser,{
      new:true,
      runValidators:true
    })
    return ({
      userData:updatedUserData
    })
  };

  if (user?.avatar?.public_id) {
    cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
    await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
    });
    const userData = await uplaodAvatar(avatar)
    return res.status(201).json({
      success:true,
      message:'User avatar updated successfully',
      data:userData?.userData
    })
  } else {
    const userData = await uplaodAvatar(avatar)
     return res.status(201).json({
      success:true,
      message:'User avatar updated successfully',
      data:userData?.userData
    })
  }
});

export const Get_All_Users = AsyncWrapper(async(req,res,next)=>{
  const users = await userModel.find().sort({createdAt:-1})
  return res.status(200).json({
    success:true,
    data:users
  })
})

export const Update_User_Role= AsyncWrapper(async(req,res,next)=>{
  const userId = req.params?.id
  const userRole = req.body?.role
  const updatedRoleUser = await userModel.findByIdAndUpdate(userId,{role:userRole},{new:true, runValidators:true})
  console.log('issue is ',updatedRoleUser)
  if(!updatedRoleUser){
    return next(customError(400,'Failed to update User ROle'))
  }
  return res.status(201).json({
    success:true,
    message:'User role updated successfully',
    data:updatedRoleUser
  })
})

export const Delete_User = AsyncWrapper(async(req,res,next)=>{
  const userId = req.params?.id
  const userDeleted = await userModel.findByIdAndDelete(userId)
  await redisClient.del(userId)
  if(!userDeleted){
    return next(customError(400,'Failed to delete requested User'))
  }
  return res.status(200).json({
    success:true,
    message:'User Deleted successfully'
  })
})

