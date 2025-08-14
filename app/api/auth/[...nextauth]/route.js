// app/api/auth/[...nextauth]/route.js
import mongoconnect from "@/lib/mongo";
import User from "@/models/user";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";


// Read the environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Check if the environment variables are loaded correctly
if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing Google OAuth credentials in .env.local");
}

// Define and export the authentication options
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await mongoconnect();
          const user = await User.findOne({ email });

          if (!user) { return null; }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) { return null; }
          
          // The 'user' object from your database (with the _id) is returned here
          return user; 
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  // 👇 THIS SECTION IS LIKELY MISSING OR INCORRECT IN YOUR CODE
  callbacks: {
    // ✅ 2. Updated JWT callback to handle both login types
    async jwt({ token, user }) {
      // The 'user' object is available on the first sign-in
      if (user) {
        // user._id is from your MongoDB (Credentials)
        // user.id is from the OAuth provider (Google)
        token.id = user._id?.toString() || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the ID from the token to the session object
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};




// Create the handler using the single authOptions object
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };