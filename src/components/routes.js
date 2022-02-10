import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LinkedInPopUp } from "react-linkedin-login-oauth2";
import { EmptyLayout, LayoutRoute, MainLayout } from "./layout";
import PageSpinner from "./PageSpinner";
import Notification from "./notification/notification";
import retry from "../libs/lazyLoading";

const IdeaHelpPage = React.lazy(() =>
  retry(() => import("./Idea/ideaHelp"))
);
const IdeaFormPage = React.lazy(() => retry(() => import("./Idea/ideaForm")));
const DetailsIdeaPage = React.lazy(() =>
  retry(() => import("./Idea/DetailsIdea"))
);
const DashboardPage = React.lazy(() =>
  retry(() => import("./dashboard/dashboardPage"))
);
const Report = React.lazy(() => retry(() => import("./admin/Report")));

const SavedIdeasPage = React.lazy(() =>
  retry(() => import("./Idea/savedIdeas"))
);
const RequestPage = React.lazy(() => retry(() => import("./request/request")));
const Contact = React.lazy(() => retry(() => import("./contact/contact")));
const AccountSettingsPage = React.lazy(() =>
  retry(() => import("./profile/accountSettings"))
);
const ProfileDetails = React.lazy(() =>
  retry(() => import("./Users/ProfileDetails"))
);
const AdminDashboardPage = React.lazy(() =>
  retry(() => import("./admin/adminDashboardPage"))
);
const Users = React.lazy(() =>
  retry(() => import("../components/Users/users"))
);
const AdminUsers = React.lazy(() => retry(() => import("./admin/usersPage")));
const AdminIdeas = React.lazy(() => retry(() => import("./admin/ideasPage")));
const AllUsers = React.lazy(() => retry(() => import("./Users/peoplePage")));
const Login = React.lazy(() => retry(() => import("./auth/login")));
const ForgotPassword = React.lazy(() =>
  retry(() => import("./auth/forgot-password"))
);
const Register = React.lazy(() => retry(() => import("./auth/register")));
const Role = React.lazy(() => retry(() => import("./auth/role")));
const PrivacyAndPolicy = React.lazy(() =>
  retry(() => import("../components/legal/privacyPolicy"))
);
const TermAndCondition = React.lazy(() =>
  retry(() => import("../components/legal/termCondition"))
);
const EmailVerification = React.lazy(() =>
  retry(() => import("./auth/emailVerification"))
);
const NotVerified = React.lazy(() => retry(() => import("./auth/notVerified")));

const Connections = React.lazy(() =>
  retry(() => import("./connections/connection"))
);

/* define all the routes */
class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <LayoutRoute
          exact
          path="/login"
          layout={EmptyLayout}
          component={(props) => <Login {...props} />}
        />
        <LayoutRoute
          exact
          path="/register"
          layout={EmptyLayout}
          component={(props) => <Register {...props} />}
        />
        <LayoutRoute
          exact
          path="/forgot-password"
          layout={EmptyLayout}
          component={(props) => <ForgotPassword {...props} />}
        />
        <LayoutRoute
          exact
          path="/role"
          layout={EmptyLayout}
          component={(props) => <Role {...props} />}
        />

        <LayoutRoute
          exact
          path="/notVerified"
          layout={EmptyLayout}
          component={(props) => <NotVerified {...props} />}
        />
        <LayoutRoute
          exact
          path="/emailVerification"
          layout={EmptyLayout}
          component={(props) => <EmailVerification {...props} />}
        />
        <LayoutRoute
          exact
          path="/notVerifiedContact"
          layout={EmptyLayout}
          component={(props) => <Contact {...props} />}
        />

        <LayoutRoute
          exact
          path="/term-condition"
          layout={EmptyLayout}
          component={(props) => <TermAndCondition {...props} />}
        />

        <LayoutRoute
          exact
          path="/privacy-policy"
          layout={EmptyLayout}
          component={(props) => <PrivacyAndPolicy {...props} />}
        />

        <Route exact path="/linkedIn" component={LinkedInPopUp} />

        <MainLayout breakpoint={this.props.breakpoint}>
          <React.Suspense fallback={<PageSpinner />}>
            <Route exact path="/" component={DashboardPage} />
            <Route exact path="/connections" component={Connections} />
            <Route exacr path="/bookmarks" component={SavedIdeasPage} />
            <Route exact path="/detailsIdea/:id" component={DetailsIdeaPage} />
            <Route exact path="/profile/:uid" component={ProfileDetails} />
            <Route exact path="/investors/:id" component={Users} />
            <Route exact path="/experts/:id" component={Users} />
            <Route exact path="/entrepreneurs/:id" component={Users} />

            <Route exact path="/create-pitch" component={IdeaFormPage} />
            <Route exact path="/edit-pitch/:id" component={IdeaFormPage} />
            <Route
              exact
              path="/help/quick-pitch"
              component={IdeaHelpPage}
            />
            <Route
              exact
              path="/help/investor-pitch"
              component={IdeaHelpPage}
            />
            <Route exact path="/help" component={IdeaHelpPage} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/notification" component={Notification} />
            <Route exact path="/people" component={AllUsers} />
            <Route
              exact
              path="/admin-dashboard"
              component={AdminDashboardPage}
            />
            <Route exact path="/report" component={Report} />
            <Route exact path="/users" component={AdminUsers} />
            <Route exact path="/ideas" component={AdminIdeas} />
            <Route
              exact
              path="/account-settings"
              component={AccountSettingsPage}
            />
             <Route
              exact
              path="/account-settings/:tab"
              component={AccountSettingsPage}
            />
            <Route exact path="/requests" component={RequestPage} />
          </React.Suspense>
        </MainLayout>
        <Redirect to="/" />
      </Switch>
    );
  }
}
export default Routes;
