import { createAsyncThunk } from '@reduxjs/toolkit';
import { web3Login } from '../../services/web3.services';

// import faceKIAPI, {
//   EnrollUserParams,
//   VerifyParams,
//   RemoveUserParams,
// } from '../../services/faceKI/faceKI.service';
// import { FaceAttributes } from '../../services/faceKI/types';

export const getWeb3User = createAsyncThunk('signUp/web3Login', async () => {
  const response = await web3Login();
  return { email: response?.userInfo?.email || '', privateKey: response.privKey || '' };
});
//
// export const livelinessCheck = createAsyncThunk(
//   'signUp/livelinessCheck',
//   async (params: VerifyParams) => {
//     const response = await faceKIAPI.livelinessCheck(params);
//     return response.data as FaceAttributes;
//   },
// );
//
// export const enrollUser = createAsyncThunk(
//   'signUp/enrollUser',
//   async (params: EnrollUserParams) => {
//     const response = await faceKIAPI.enrollUser(params);
//     return response.data as any;
//   },
// );
//
// export const verifyUser = createAsyncThunk('signUp/verifyUser', async (params: VerifyParams) => {
//   const response = await faceKIAPI.verifyUser(params);
//   return response.data;
// });
//
// export const userList = createAsyncThunk('signUp/userList', async () => {
//   const response = await faceKIAPI.userList();
//   return response.data;
// });
//
// export const removeUser = createAsyncThunk(
//   'signUp/removeUser',
//   async (params: RemoveUserParams) => {
//     const response = await faceKIAPI.removeUser(params);
//     return response.data;
//   },
// );
//
// export const removeAllUsers = createAsyncThunk('signUp/removeAllUsers', async () => {
//   const response = await faceKIAPI.removeAllUsers();
//   return response.data;
// });
