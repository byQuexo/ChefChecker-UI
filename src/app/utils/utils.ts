export const getHTTP = () => {
    return {
        post: async (url: string, data: string | Record<string, string>) => {
            const bodyData = typeof data === 'string' ? data : JSON.stringify(data);
            return await fetch(url, {
                method: "POST",
                body: bodyData,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },

        get: async (url: string) => {
            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    }
}