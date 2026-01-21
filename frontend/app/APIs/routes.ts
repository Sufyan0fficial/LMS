//User Authentication

import axios from "axios";
import {
  IActivateAccountPayload,
  IActivateAccountResponse,
  IAnalyticsResponse,
  ICreateCheckoutSessionPayload,
  ICreateCheckoutSessionResponse,
  IDeleteCourseResponse,
  IDeleteUserResponse,
  IDemoVideoResponse,
  IEditCourseResponse,
  IForgetPasswordPayload,
  IForgetPasswordResponse,
  IGetAllCoursesResponse,
  IGetAllUsersResponse,
  IGetSingleCourseResponse,
  IGetUserProfileResponse,
  ILayoutPayload,
  ILayoutResponse,
  IloginUserPayload,
  IloginUserResponse,
  ILogoutUserResponse,
  IOrdersResponse,
  IPaymentVerificationPayload,
  IPaymentVerificationResponse,
  IRefreshAccessTokenResponse,
  IRegisterUserPayload,
  IRegisterUserResponseData,
  IResendCodePayload,
  IResendCodeResponse,
  IResetPasswordPayload,
  IResetPasswordResponse,
  ISocialOauthPayload,
  ISocialOauthResponse,
  IUpdateAvatarPayload,
  IUpdateAvatarResponse,
  IUpdatePasswordPayload,
  IUpdatePasswordResponse,
  IUpdateUserProfilePayload,
  IUpdateUserProfileResponse,
  IUpdateUserRolePayload,
  IUpdateUserRoleResponse,
  IUploadCoursePayload,
  IUploadCourseResponse,
} from "../types/apifn.types";
import { ICreateOrderPayload, ICreateOrderResponse, ICourseContentResponse } from "../types/apifn.types";
import { axiosInstance } from "./config";
import { ICreateCoursePayload } from "../(AdminGroup)/admin/create-courses/page";

export const RegisterUser = async (payload: IRegisterUserPayload) => {
  return axiosInstance.post<IRegisterUserResponseData>(
    "/userAuth/register",
    payload
  );
};

export const ActivateAccount = async (
  payload: IActivateAccountPayload,
  verifyEmail: boolean
) => {
  const path = verifyEmail
    ? "/userAuth/activate-account?email=true"
    : "/userAuth/activate-account";
  return axiosInstance.post<IActivateAccountResponse>(path, payload);
};

export const ResendActivationCode = async (payload: IResendCodePayload) => {
  return axiosInstance.post<IResendCodeResponse>(
    "/userAuth/resend-code",
    payload
  );
};

export const LoginUser = async (payload: IloginUserPayload) => {
  return axiosInstance.post<IloginUserResponse>("/userAuth/login", payload);
};

export const ForgetPassword = async (payload: IForgetPasswordPayload) => {
  return axiosInstance.post<IForgetPasswordResponse>(
    "/userAuth/forget-password",
    payload
  );
};

export const ResetPasswordApi = async (payload: IResetPasswordPayload) => {
  return axiosInstance.post<IResetPasswordResponse>(
    "/userAuth/reset-password",
    payload
  );
};
export const LogoutUser = async () => {
  return axiosInstance.get<ILogoutUserResponse>("/userAuth/logout");
};

export const SocialOauth = async (payload: ISocialOauthPayload) => {
  return axiosInstance.post<ISocialOauthResponse>(
    "/userAuth/social-oauth",
    payload
  );
};
export const RefreshToken = async () => {
  return axiosInstance.get<IRefreshAccessTokenResponse>(
    "/userAuth/refresh-token"
  );
};
export const GetProfileData = async () => {
  return axiosInstance.get<IGetUserProfileResponse>("/userAuth/me");
};
export const UpdateProfile = async (payload: IUpdateUserProfilePayload) => {
  return axiosInstance.post<IUpdateUserProfileResponse>(
    "/userAuth/update-profile",
    payload
  );
};
export const UpdatePassword = async (payload: IUpdatePasswordPayload) => {
  return axiosInstance.patch<IUpdatePasswordResponse>(
    "/userAuth/update-password",
    payload
  );
};
export const UpdateAvatar = async (payload: IUpdateAvatarPayload) => {
  return axiosInstance.patch<IUpdateAvatarResponse>(
    "/userAuth/update-avatar",
    payload
  );
};
export const GetAllUsers = async () => {
  return axiosInstance.get<IGetAllUsersResponse>("/userAuth/get-all-users");
};
export const UpdateRole = async (
  payload: IUpdateUserRolePayload,
) => {
  return axiosInstance.patch<IUpdateUserRoleResponse>(
    `/userAuth/update-role`,
    payload
  );
};
export const DeleteUser = async (id: string) => {
  return axiosInstance.delete<IDeleteUserResponse>(
    `/userAuth/update-role/${id}`
  );
};

export const GetDemoVideo = async (videoUrl: { videoUrl: string }) => {
  return axiosInstance.post<IDemoVideoResponse>(
    "/courses/get-demoVideo",
    videoUrl
  );
};

export const CreateCourseApiFn = async (payload: IUploadCoursePayload) => {
  return axiosInstance.post<IUploadCourseResponse>("/courses/upload", payload);
};

export const GetAllCoursesApi = async () => {
  return axiosInstance.get<IGetAllCoursesResponse>("/courses/get-all-courses");
};
export const DeleteCourseApi = async (id:string) => {
  return axiosInstance.delete<IDeleteCourseResponse>(`/courses/delete-course/${id}`)
};
export const GetSingleCourseApi = async (id:string | null) => {
  return axiosInstance.get<IGetSingleCourseResponse>(`/courses/get-course/${id}`)
};
export const EditCourseApi = async (payload:ICreateCoursePayload,id:string | null) => {
  return axiosInstance.patch<IEditCourseResponse>(`/courses/edit/${id}`,payload)
};

export const CreateLayoutApi = async (payload:ILayoutPayload) => {
  return axiosInstance.post<ILayoutResponse>(`/layout/create`,payload)
};
export const GetLayoutDataApi = async (payload:{type:string}) => {
  return axiosInstance.post<ILayoutResponse>(`/layout/get-layout`,payload)
};
export const UpdateLayoutApi = async (payload:ILayoutPayload) => {
  return axiosInstance.patch<ILayoutResponse>(`/layout/update`,payload)
};


export const GetCourseAnalyticsApi = async()=>{
  return axiosInstance.get<IAnalyticsResponse>('/analytics/course')
}
export const GetUsersAnalyticsApi = async()=>{
  return axiosInstance.get<IAnalyticsResponse>('/analytics/user')
}
export const GetOrdersAnalyticsApi = async()=>{
  return axiosInstance.get<IAnalyticsResponse>('/analytics/order')
}


export const GetAllOrders = async()=>{
  return axiosInstance.get<IOrdersResponse>('/order/get-all-orders')
}


export const GetCoursesApi = async()=>{
  return axiosInstance.get<IGetAllCoursesResponse>('/courses/get-courses')
}

export const CreateCheckoutSessionApi = async(payload:ICreateCheckoutSessionPayload)=>{
  return axiosInstance.post<ICreateCheckoutSessionResponse>('/payment/create-checkout-session',payload)
}

export const SessionVerificationApi = async(payload:IPaymentVerificationPayload)=>{
  return axiosInstance.post<IPaymentVerificationResponse>('/payment/verification',payload)
}




export const CreateOrderApi = async(payload:ICreateOrderPayload)=>{
  return axiosInstance.post<ICreateOrderResponse>('/order/create',payload)
}

export const GetCourseContentApi = async(id:string)=>{
  return axiosInstance.get<ICourseContentResponse>(`/courses/get-course-content/${id}`)
}
