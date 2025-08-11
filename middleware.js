// middleware.js

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/home/:path*",
            "/folders/:path*",
  ],
   // Protects all routes starting with /home
  
};