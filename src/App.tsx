
import { BrowserRouter, Route, Switch } from 'react-router-dom';



import { Home } from "./pages/Home";

import { NewRoom } from "./pages/NewRoom";

import { Room } from "./pages/Room";

import { AuthContextProvider } from './contexts/AuthContextProvider'


function App() {


  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/rooms/new" component={NewRoom} />
          <Route exact path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
