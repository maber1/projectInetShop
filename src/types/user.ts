export interface IProfileResponse {
  id: string;
  name: string;
  email: string;
  signUpDate: Date;
}

export interface ILoginResponse {
  token: string;
  profile: {
    _id: string;
    email: string;
    name?: string;
  };
}

export interface IChangePassResponse {
  success: boolean;
}
