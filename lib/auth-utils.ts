import { auth } from '@/auth';
import { jwtVerify } from 'jose';

/**
 * Helper to authenticate an API request.
 * It first checks for a standard NextAuth session cookie.
 * If not present, it attempts to validate a Bearer JWT token from the Authorization header.
 * 
 * @param request The incoming HTTP request
 * @returns The user's ID string if authenticated, otherwise null
 */
export async function getUserId(request: Request): Promise<string | null> {
  // 1. Try NextAuth session first
  try {
    const session = await auth();
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch (err) {
    console.error("NextAuth session check failed:", err);
  }

  // 2. Fallback to JWT Bearer Token validation
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret");
      const { payload } = await jwtVerify(token, secret);

      if (payload && typeof payload.id === 'string') {
        return payload.id;
      }
    } catch (err) {
      console.error("JWT validation failed:", err);
    }
  }

  return null;
}
