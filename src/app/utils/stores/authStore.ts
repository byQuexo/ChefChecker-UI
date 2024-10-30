import { RegisterResponse, LoginResponse } from "./types";
import { getHTTP } from "@/app/utils/utils";

class AuthStore{
    
    async register(username: string, email: string, password: string): Promise<RegisterResponse | null | undefined> {
        try {

            const data = {username, email, password}
            const response = await getHTTP().post('/api/auth/register', JSON.stringify(data));

            const registerData = await response.json();//convert/parse response body to JSON

            if (!response.ok) {
                console.log("failed to register", registerData.error);
                return;
            }

            console.log (registerData.user);
            return registerData;
        } catch (error) {
            console.log("error in registration:", error);
            return null;
        }
    }

    async login(email: string, password: string): Promise<LoginResponse | null | undefined>{
        try {
            const data = {email, password}
            const response = await getHTTP().post('/api/auth/login', JSON.stringify(data));
            
            const loginData = await response.json();

            if (!response.ok) {             
                console.log("failed to log in", loginData.error);
                return;
            } 
            
            console.log (loginData.user);
            return loginData;
                
        } catch (error) {
            console.log("error in logging in:", error);
            return null;
        }
    
    }
}
const authStore = new AuthStore();

export {authStore};