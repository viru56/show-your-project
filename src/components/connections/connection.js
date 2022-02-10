import React, { Component } from "react";
import PageSpinner from "../../components/PageSpinner";
import Page from "../page";
import {
  Grid,
  Container,
  Typography,
  Tab,
  Tabs,
} from "@material-ui/core";
import UserCard from "../Users/userCard";
import { findConnections } from '../../store/actions/connection_action';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


/* show all connections */
class Connections extends Component {

  state = {
    isLoading: true,
    connections: [],
    entrepreneurs: [],
    investors: [],
    experts: [],
    value: 0
  }

  async componentDidMount() {
    await this.props.findConnections(this.props.User.user.email);
    const entrepreneurs = [];
    const experts = [];
    const investors = [];
    const connections = [];
    if (this.props.Connection.connections.length === 0) {
      await this.setState({ isLoading: false });
      return;
    }
    for (const connection of this.props.Connection.connections) {
      if (connection.isConnected) {
        connections.push(connection);
        if (connection.role === 'entrepreneur') {
          entrepreneurs.push(connection);
        }
        else if (connection.role === 'investor') {
          investors.push(connection);
        }
        else if (connection.role === 'expert') {
          experts.push(connection);
        }
      }
    }
    await this.setState({
      entrepreneurs, experts, investors, connections, isLoading: false
    });
  }
  changeTabPanel = (event, newValue) => {
    this.setState({ value: newValue })
  }
  sendMessage = (email) => {
    console.log(email);
  }
  render() {
    if (this.state.isLoding) {
      return <PageSpinner />;
    } else
      return (
        <Page className="peoplePage">
          <Container className="mb-4">
            <Grid container>
              <Grid item xs={12} sm={12} md={12} ld={12}>
                <Tabs value={this.state.value} onChange={this.changeTabPanel} variant="scrollable">
                  <Tab label=" All Connections" value={0} />
                  <Tab label="Experts" value={1} />
                  <Tab label="Investors" value={2} />
                  <Tab label="Entrepreneurs" value={3} />
                </Tabs>
                <hr />
              </Grid>
            </Grid>
            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.value !== 0}
              id={`tabpanel-${0}`}
            >
              <Grid container justifyContent="center" spacing={3}>
                {this.state.connections.length > 0 ? (
                  this.state.connections.map(user => (
                    <Grid item key={user.email}>
                      <UserCard user={user} />
                    </Grid>
                  ))
                ) : (
                    <Typography className="p-5">Connections Not Found</Typography>
                  )}
              </Grid>

            </Typography>

            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.value !== 1}
              id={`tabpanel-${1}`}
            >
              <Grid container justifyContent="center" spacing={3}>
                {this.state.experts && this.state.experts.length > 0 ? (
                  this.state.experts.map(user => (
                    <Grid item key={user.email}>
                      <UserCard user={user} sendMessage={this.sendMessage} />
                    </Grid>
                  ))
                ) : (
                    <Typography className="p-5">Expert Not Found</Typography>
                  )}
              </Grid>
            </Typography>
            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.value !== 2}
              id={`tabpanel-${2}`}
            >
              <Grid container justifyContent="center" spacing={3}>
                {this.state.investors.length > 0 ? (
                  this.state.investors.map(user => (
                    <Grid item key={user.email}>
                      <UserCard user={user} sendMessage={this.sendMessage} />
                    </Grid>
                  ))
                ) : (
                    <Typography className="p-5">Investor Not Found</Typography>
                  )}
              </Grid>
            </Typography>

            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.value !== 3}
              id={`tabpanel-${3}`}
            >
              <Grid container justifyContent="center" spacing={3}>
                {this.state.entrepreneurs.length > 0 ? (
                  this.state.entrepreneurs.map(user => (
                    <Grid item key={user.email}>
                      <UserCard user={user} sendMessage={this.sendMessage} />
                    </Grid>
                  ))
                ) : (
                    <Typography className="p-5">Entrepreneur Not Found</Typography>
                  )}
              </Grid>
            </Typography>
          </Container>
        </Page>
      );
  }
}

const mapStateToProps = state => {
  return {
    Connection: state.Connection,
    User: state.User
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      findConnections
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Connections));
