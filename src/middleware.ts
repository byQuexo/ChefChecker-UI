import {jwtDecode, JwtPayload} from "jwt-decode";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: '/api/:function*',
}

export async function middleware(req: NextRequest) {

    if (req.nextUrl.pathname.startsWith('/api/')) {
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('Authorization', `Bearer ${process.env.CLIENT_TOKEN}`)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }


    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json({
                message: 'Missing or invalid Authorization header' },
                {
                    status: 401,
                    headers: { 
                        'Content-Type': 'application/json',
                     }
                }
        );
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        const evalObject = {
            email: "tim@tim.de"
        }

        if(JSON.stringify(decoded) !== JSON.stringify(evalObject)) {
            return Response.json({
                    message: 'Missing or invalid Authorization header' },
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json',
                     }
                }
            );
        }

    } catch (e) {
        console.log(e);
        return Response.json({ message: 'Invalid or expired token' },
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }
}