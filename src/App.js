import './App.scss';
import BuyerInfo from './components/BuyerInfo/BuyerInfo';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AddBuyer from './components/AddBuyer/AddBuyer';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <BuyerInfo />
            </Route>
            <Route path="/addBuyer">
              <AddBuyer />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;