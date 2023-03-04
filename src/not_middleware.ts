import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { useSession } from 'next-auth/react';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // return NextResponse.redirect(new URL('/about-2', request.url))
    const { data: sessionData } = useSession();

	if (!sessionData?.user && request.url == "dashboard") return NextResponse.redirect("/")
    return  NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
//     matcher: '/about/:path*',
// }