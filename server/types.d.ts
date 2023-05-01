export interface UserData {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export interface CreateUser extends UserData {
  _type: string;
  password: string;
}
