export default function useAuth() {
    const login = async (email, password) => {
        console.log('Logging in:', email);
    };
    const signup = async (email, password) => {
        console.log('Signing up:', email);
    };
    const logout = async () => console.log('Logged out');

    return { login, signup, logout };
}
