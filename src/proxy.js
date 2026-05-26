import { NextResponse } from 'next/server'
import { verifyAccessToken, verifyRefreshToken } from './lib/auth.js'

export default function proxy(request) {
    let accessToken = request.cookies.get('accessToken')

    if (!accessToken) {
        return NextResponse.next()
    }

    let decodedAccessToken = verifyAccessToken(accessToken.value)
    if (decodedAccessToken.error) {
        return NextResponse.next()
    }

    let refreshToken = request.cookies.get('refreshToken')
    if (!refreshToken) {
        return NextResponse.next()
    }

    let decodedRefreshToken = verifyRefreshToken(refreshToken.value)
    if (decodedRefreshToken.error) {
        return NextResponse.next()
    }
    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("x-user-id", decodedAccessToken.id);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: '/api/auth/me',
}