import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from '@renderer/page/Home/Index';
import Dashboard from '@renderer/page/Dashboard';
import CreateAccount from '@renderer/page/CreateAccount';
import Settings from '@renderer/page/Settings';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/createaccount" component={CreateAccount} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </Router>
  );
};

export default Routes;
