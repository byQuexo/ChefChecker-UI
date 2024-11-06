const TOKEN = process.env.NEXT_PUBLIC_CLIENT_TOKEN
if (!TOKEN) {
    throw new Error('CLIENT_TOKEN environment variable is not set');
}

export const getHTTP = () => {
    return {
        post: async (url: string, data: string | Record<string, never>) => {
            if (!TOKEN) {
                throw new Error('No authorization token available');
            }

            const bodyData = typeof data === 'string' ? data : JSON.stringify(data);

            return await fetch(url, {
                method: "POST",
                body: bodyData,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
        },

        get: async (url: string) => {
            if (!TOKEN) {
                throw new Error('No authorization token available');
            }

            return await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
        }
    }
}