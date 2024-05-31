import { flow, getParent, types } from 'mobx-state-tree';
import { makeQuery } from '../api';
import { IChangePassResponse, ILoginResponse, IProfileResponse } from '../types/user';
import { IErrorsResponse, IResponse } from '../types/query';
import { ISODate } from './customTypes';
import { RootInstance } from '.';

export const UserModel = types
  .model({
    access_token: types.optional(types.string, ''),
    loading: types.optional(types.boolean, false),
    isAuth: types.optional(types.boolean, false),
    userinfo: types.model({
      id: types.maybeNull(types.string),
      name: types.maybe(types.string),
      email: types.maybeNull(types.string),
      signUpDate: types.maybeNull(ISODate),
    }),
  })
  .actions((self) => {
    const rootStore = getParent<RootInstance>(self);
    const login = flow(function* (params: { email: string; password: string }) {
      self.loading = true;

      const response: IResponse<ILoginResponse> = yield makeQuery('signin', 'POST', params);

      self.loading = false;
      if (response.ok) {
        self.access_token = response.data.token;
        self.isAuth = true;
        self.userinfo.id = response.data.profile._id;
        self.userinfo.name = response.data.profile.name;
        self.userinfo.email = response.data.profile.email;
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('isAuth', String(1));
        localStorage.setItem('userID', String(response.data.profile._id));
        localStorage.setItem('name', String(response.data.profile.name));
        localStorage.setItem('email', String(response.data.profile.email));
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }

      return response;
    });

    const logout = () => {
      self.access_token = '';
      self.isAuth = false;
      self.userinfo.id = '';
      self.userinfo.name = '';
      self.userinfo.email = '';
      localStorage.removeItem('access_token');
      localStorage.removeItem('isAuth');
      localStorage.removeItem('userID');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
    };

    const registerUser = flow(function* (params: { email: string; password: string }) {
      const { email, password } = params;
      const commandId = Date.now();

      self.loading = true;

      const response: IResponse = yield makeQuery('signup', 'POST', { email, password, commandId });

      if (response.ok) {
        yield login({ email, password });
        rootStore.setNotificationSuccess('Регистрация успешна');
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }
      self.loading = false;

      return response;
    });

    const fetchProfile = flow(function* () {
      self.loading = true;
      const response: IResponse<IProfileResponse> = yield makeQuery('profile');

      self.loading = false;
      if (response.ok) {
        if (response.data) {
          self.userinfo.id = response.data.id;
          self.userinfo.name = response.data?.name;
          self.userinfo.email = response.data.email;
          self.userinfo.signUpDate = response.data.signUpDate;
        } else {
          logout();
          rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
        }
      }

      return response;
    });

    const updateProfile = flow(function* (name: string) {
      self.loading = true;
      const response: IResponse<IProfileResponse> = yield makeQuery('profile', 'PATCH', { name });

      self.loading = false;
      if (response.ok) {
        self.userinfo.name = response.data.name;
        rootStore.setNotificationSuccess('Имя успешно изменено');
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }

      return response;
    });

    const changePassword = flow(function* (oldPassword: string, newPassword: string) {
      self.loading = true;
      const response: IResponse<IChangePassResponse> = yield makeQuery('profile/change-password', 'POST', {
        password: oldPassword,
        newPassword: newPassword,
      });

      self.loading = false;
      if (response.ok) {
        rootStore.setNotificationSuccess('Пароль успешно изменен');
      } else {
        rootStore.setNotificationError((response.data as unknown as IErrorsResponse).errors[0].message);
      }

      return response;
    });

    return { registerUser, updateProfile, changePassword, login, fetchProfile, logout };
  });
