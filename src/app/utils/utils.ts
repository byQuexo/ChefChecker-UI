const TOKEN = process.env.API_AUTHENTICATION_TOKEN; 

export const getHTTP = () => {
    return {
        post: async (url: string, data: string) => {
            console.log("token used:", TOKEN);
            const response = await fetch(url, {
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
            return response;
        },


        //GET methods
        get: async (url: string) => {
            console.log("token used:", TOKEN);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
            return response;
            
        }
    }
};