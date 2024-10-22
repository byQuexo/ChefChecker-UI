import {jwtDecode, JwtPayload} from "jwt-decode";

export const config = {
    matcher: '/api/:function*',
}

export async function middleware(req: Request) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json({
                message: 'Missing or invalid Authorization header' },
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
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
                    headers: { 'Content-Type': 'application/json' }
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