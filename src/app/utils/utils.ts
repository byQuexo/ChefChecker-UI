import axios from 'axios';

const TOKEN = process.env.API_AUTHENTICATION_TOKEN;

const axiosInstance = axios.create({
    baseURL: 'https://localhost:3000',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`,
        },
});

export const getHTTP = () => {

    return {
        axios: axiosInstance,
        post: async (url: string, data: object) => {
            console.log("token used:", TOKEN);
            const response = await axiosInstance.post(url, data);
            return response.data;
            
        },

        //GET nethods
        get: async (url: string): Promise<Response | null> => {
            console.log("token used:", TOKEN);
            const response = await axiosInstance.get(url);
            return null;
            
        }
    }
};