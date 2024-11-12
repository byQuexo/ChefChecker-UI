import {makeAutoObservable} from "mobx";
import {getHTTP} from "@/app/utils/utils";

class RootStore {
    private currentUserId: string | null = null;
    private userThemeMode: boolean = false;
    private isInitialized: boolean = false;
    private userProfilePicture: string | null = null;
    private isUpdatingTheme: boolean = false;
    private userFavorites: string | null = null;


    constructor() {
        makeAutoObservable(this);
        this.initializeStore();
    }

    private initializeStore(): void {

        if (typeof window !== 'undefined' && !this.isInitialized) {
            const storedUserId = window.localStorage.getItem('id');
            const storedDarkMode = window.localStorage.getItem('darkMode');
            const profilePicture = window.localStorage.getItem('profilePicture')
            const userFavorites = window.localStorage.getItem('userFavorites')

            this.currentUserId = storedUserId;
            this.userThemeMode = storedDarkMode === 'true';
            this.userProfilePicture = profilePicture;
            this.userFavorites = userFavorites

            if (storedDarkMode === null) {
                window.localStorage.setItem('darkMode', "false");
                this.userThemeMode = false;
            }

            this.isInitialized = true;
        }
    }

    public setUserId(userId: string): void {
        this.currentUserId = userId;

        if (typeof window !== 'undefined' && userId) {
            window.localStorage.setItem('id', userId);
        }
    }

    public setDarkMode(mode: boolean): void {
        this.userThemeMode = mode;

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('darkMode', String(mode));
        }

    }

    public setProfilePicture(profilePicture: string): void {
        this.userProfilePicture = profilePicture;

        if (typeof window !== 'undefined' && profilePicture) {
            window.localStorage.setItem('profilePicture', profilePicture);
        }
    }

    public setUserFavorites(userFavorites: string): void {
        this.userFavorites = userFavorites;

        if (typeof window !== 'undefined' && userFavorites) {
            window.localStorage.setItem('profilePicture', userFavorites);
        }
    }


    public async updatePreferences(pref: { darkMode: boolean, metrics?: string }, updateServer: boolean = true,): Promise<void> {
        try {
            if (this.isUpdatingTheme) return;
            this.isUpdatingTheme = true;

            this.userThemeMode = pref.darkMode;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('darkMode', String(pref.darkMode));
                document.documentElement.classList.toggle('dark', pref.darkMode);
            }

            if (updateServer && this.currentUserId) {
                const req = await getHTTP().post("/api/users/preferences", JSON.stringify({
                    userId: this.currentUserId,
                    preferences: {
                        darkMode: pref.darkMode ? "dark" : "light"
                    }
                }));
                if (req.status !== 200){
                    console.log("registration failed", req);
                    throw new Error("Failed")
                }
            }

        } catch (e) {
            console.error('Error updating dark mode:', e);
            this.userThemeMode = !pref.darkMode;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('darkMode', String(!pref.darkMode));
                document.documentElement.classList.toggle('dark', !pref.darkMode);
            }
            throw e;
        } finally {
            this.isUpdatingTheme = false;
        }
    }

    get userId(): string | null {
        if (!this.isInitialized) {
            this.initializeStore();
        }
        return this.currentUserId;
    }

    get darkMode(): boolean {
        if (!this.isInitialized) {
            this.initializeStore();
        }
        return this.userThemeMode;
    }

    get profilePicture(): string | null{
        if (!this.isInitialized) {
            this.initializeStore();
        }
        return this.userProfilePicture;
    }

    get usersFavorites(): string | null {
        if (!this.isInitialized) {
            this.initializeStore();
        }
        return this.userFavorites;
    }

    public clearStore(): void {
        this.currentUserId = null;
        this.userThemeMode = false;

        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('id');
            window.localStorage.setItem('darkMode', 'false');
        }
    }
}

export const rootStore = new RootStore();
export default rootStore;