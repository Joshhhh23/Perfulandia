import AppRoutes from './app/routes';
import { AppProvider } from './context/AppContext'; 
import { AuthProvider } from './context/AuthContext'; 

function App(){ 
    return (
        <AuthProvider>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </AuthProvider>
    );
}

export default App;