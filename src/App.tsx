
import { BrowserRouter, Route } from 'react-router-dom';



import { Home } from "./pages/Home";

import { NewRoom } from "./pages/NewRoom";

import { AuthContextProvider } from './contexts/AuthContextProvider'


function App() {


  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route exact path="/" component={Home} />
        <Route exact path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
