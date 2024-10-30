const TOKEN = process.env.NEXT_PUBLIC_API_AUTHENTICATION_TOKEN; //for client-side access

export const getHTTP = () => {
    return {
        post: async (url: string, data: string) => {
            console.log("token used:", TOKEN);
            return fetch(url, {
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
        }
    }
};