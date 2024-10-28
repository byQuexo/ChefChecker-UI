class AuthStore{
    
    async register(username: string, email: string, password: string): Promise<any> {
        try {
            const response = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpbUB0aW0uZGUifQ.9UhJy6wUc6RkNWsklp3av5f5hWrqmjbaYMR1tphoDwg`
                },
                body: JSON.stringify({ username, email, password })
            });
            const registerData = await response.json();//convert/parse response body to JSON

            if (!response.ok) {
                
                console.log("failed to register", registerData.error);
            } else {
                console.log (registerData.user);
            }
        } catch (error) {
            
            console.log("error in registration:", error);
        }
    };

    async login(email: string, password: string): Promise<any>{
        try {
            const response = await fetch('/api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpbUB0aW0uZGUifQ.9UhJy6wUc6RkNWsklp3av5f5hWrqmjbaYMR1tphoDwg`
                },
                body: JSON.stringify({ email, password })
            });
            const loginData = await response.json();

            if (!response.ok) {
               
                console.log("failed to log in", loginData.error);
            } else {
                console.log (loginData.user);
            }
        } catch (error) {
            
            console.log("error in logging in:", error);
        }
    
    }
}
const authStore = new AuthStore();

export {authStore};