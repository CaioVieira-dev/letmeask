import { createContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from "./pages/Home";

import { NewRoom } from "./pages/NewRoom";

export const TestContext = createContext('');

function App() {
  return (
    <BrowserRouter>
      <TestContext.Provider value={'teste'}>
        <Route exact path="/" component={Home} />
        <Route exact path="/rooms/new" component={NewRoom} />
      </TestContext.Provider>
    </BrowserRouter>
  );
}

export default App;
