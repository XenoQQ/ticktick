import TodoApp from './components/todoApp';
import { ThemeProvider } from 'styled-components';
import { theme } from './components/styles/theme';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <TodoApp />
        </ThemeProvider>
    );
};

export default App;
