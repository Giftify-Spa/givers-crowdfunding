import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { customTheme } from "./theme";
import MontserratFont from "./fonts/MontserratFont";
import './App.css';
import { AppRouter } from "./routes/AppRouter";

function App() {
    return (
        <MantineProvider theme={customTheme}>
            <AppRouter />
            <MontserratFont />
            <Notifications position="top-right" />
        </MantineProvider>
    );
}

export default App;
