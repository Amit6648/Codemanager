// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
  ],
  // 👇 THIS SECTION IS LIKELY MISSING OR INCORRECT IN YOUR CODE
  callbacks: {
    async jwt({ token, profile }) {
      // On initial sign-in, add the user's Google ID to the token
      if (profile) {
        token.id = profile.sub; // 'sub' is Google's unique user ID
      }
      return token;
    },
    async session({ session, token }) {
      // Add the ID from the token to the session.user object
      session.user.id = token.id;
      return session;
    },
  },
};




// Create the handler using the single authOptions object
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };