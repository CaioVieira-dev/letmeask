import { createContext, useState } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from "./pages/Home";

import { NewRoom } from "./pages/NewRoom";


export const TestContext = createContext({} as any);

function App() {

  const [value, setValue] = useState('Teste')

  return (
    <BrowserRouter>
      <TestContext.Provider value={{ value, setValue }}>
        <Route exact path="/" component={Home} />
        <Route exact path="/rooms/new" component={NewRoom} />
      </TestContext.Provider>
    </BrowserRouter>
  );
}

export default App;
