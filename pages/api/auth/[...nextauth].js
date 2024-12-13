import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const allowedUsers = process.env.ALLOWED_USERS.split(',');
      if (allowedUsers.includes(user.email)) {
        return true;
      } else {
        return false;
      }
    },
  },
});