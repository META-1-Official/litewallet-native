import { createAsyncThunk } from '@reduxjs/toolkit';

import faceKIAPI, { EnrollUserParams, VerifyParams, RemoveUserParams } from '../../services/faceKI/faceKI.service';

export const livelinessCheck = createAsyncThunk(
  'faceKI/livelinessCheck',
  async () => {
    const response = await faceKIAPI.livelinessCheck();
    return response.data;
  }
);

export const enrollUser = createAsyncThunk(
  'faceKI/enrollUser',
  async (params: EnrollUserParams) => {
    const response = await faceKIAPI.enrollUser(params);
    return response.data;
  }
);

export const verifyUser = createAsyncThunk(
  'faceKI/verifyUser',
  async (params: VerifyParams) => {
    const response = await faceKIAPI.verifyUser(params);
    return response.data;
  }
);

export const userList = createAsyncThunk(
  'faceKI/userList',
  async () => {
    const response = await faceKIAPI.userList();
    return response.data;
  }
);

export const removeUser = createAsyncThunk(
  'faceKI/removeUser',
  async (params: RemoveUserParams) => {
    const response = await faceKIAPI.removeUser(params);
    return response.data;
  }
);

export const removeAllUsers = createAsyncThunk(
  'faceKI/removeAllUsers',
  async () => {
    const response = await faceKIAPI.removeAllUsers();
    return response.data;
  }
);
