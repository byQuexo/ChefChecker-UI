const TOKEN = process.env.API_AUTHENTICATION_TOKEN;

export const getHTTP = () => {
    return {
        post: async (url: string, data: string) => {
            console.log(TOKEN);
            return fetch(url, {
                    method: "POST",
                    body: JSON.parse(data),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer ' + TOKEN,
                    },
                }
            );
        }
    }
};