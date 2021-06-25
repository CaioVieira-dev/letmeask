
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from "pages/Home/index";
import { NewRoom } from "pages/NewRoom/index";
import { AdminRoom } from 'pages/Room/AdminRoom/index';
import { Room } from "pages/Room/UserRoom/index";

import { AuthContextProvider } from 'contexts/AuthContextProvider'
import { ThemeContextProvider } from 'contexts/ThemeContext';

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeContextProvider>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/rooms/new" component={NewRoom} />
            <Route exact path="/rooms/:id" component={Room} />
            <Route exact path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
        </ThemeContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
