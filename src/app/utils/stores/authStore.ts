import { RegisterResponse, LoginResponse } from "./types";
import { getHTTP } from "@/app/utils/utils";

class AuthStore{   
        async register(username: string, email: string, password: string): Promise<RegisterResponse | null | undefined> {
            try {
                const data = {username, email, password}           
                const response = await getHTTP().post('/api/auth/register', data);
                
                if (response.status !== 200){
                    console.log("registration failed", response.status);
                    return null;
                }
                const registerData = await response.json();
                return {
                    user: registerData.user
                };

    
            } catch (error) {
                console.log("error in registration:", error);
                return null;
            }
        };
    
        async login(email: string, password: string): Promise<LoginResponse | null | undefined> {
            try {
                const data = {email, password};           
                const response = await getHTTP().post('/api/auth/login', data);
                if (response.status !== 200){
                    console.log("login failed", response.status);
                    return null;
                }
                const loginData = await response.json();
                return {
                    user: loginData.user
                };
                    
            } catch (error) {
                console.log("error in logging in:", error);
                return null;
            }
        
        };
}
const authStore = new AuthStore();

export {authStore};