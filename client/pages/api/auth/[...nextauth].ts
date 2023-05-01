import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import axios from 'axios';

import type { Credentials } from '../../../types/next-auth';
import { BASE_URL } from '../../../utils/data';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as Credentials;
        if (!email || !password) {
          throw new Error('Invalid credentials');
        }

        const axiosConfig = {
          method: 'post',
          url: `${BASE_URL}/api/register/signin`,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            email,
            password,
          }),
        };

        const response = await axios
          .request(axiosConfig)
          .then((res) => res.data.user);

        if (response) {
          return {
            id: response._id,
            name: response.name,
            email: response.email,
            image: response.image,
          };
        } else return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/register',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: 'jwt',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
