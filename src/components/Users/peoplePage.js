import React, { Component } from "react";
import PageSpinner from "../PageSpinner";
import Page from "../page";
import {
    Grid,
    Container,
    Typography,
    Tab,
    Tabs,
} from "@material-ui/core";
import UserCard from "./userCard";
import { findConnections } from '../../store/actions/connection_action';
import { findAllUsers } from '../../store/actions/user_action';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/* show all users whose profile is public and give option to connect */
class AllUsers extends Component {

    state = {
        isLoading: true,
        value: 0
    }

    async componentDidMount() {
        // if (!this.props.Connection.connections) {
        //   await this.props.findConnections(this.props.User.user.email);
        // }
        if (!this.props.User.users) {
            await this.props.findAllUsers(this.props.User.user.email);
        }
        await this.setState({ isLoading: false });
    }
    changeTabPanel = async (event, newValue) => {
        await this.setState({ value: newValue });
        this.loadUsers();
    }
    loadUsers = () => {
        if (this.state.isLoading) {
            return <PageSpinner />;
        }
        let users = [];
        if (this.state.value === 0) {
            users = this.props.User.users;
        } else if (this.state.value === 1) {
            users = this.props.User.users.filter((user) => user.role === 'expert');
        } else if (this.state.value === 2) {
            users = this.props.User.users.filter((user) => user.role === 'investor');
        } else if (this.state.value === 3) {
            users = this.props.User.users.filter((user) => user.role === 'entrepreneur');
        }
        if (users.length > 0) {
            return (
                users.map(user => (
                    <Grid item key={user.email}>
                        <UserCard user={user} />
                    </Grid>
                ))
            )
        } else {
            return (
                <Typography>NO User Found</Typography>
            )
        }
    }
    render() {
        return (
            <Page className="peoplePage">
                <Container>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} ld={12}>
                            <Tabs value={this.state.value} onChange={this.changeTabPanel} variant="scrollable">
                                <Tab label=" All Users" value={0} />
                                <Tab label="Experts" value={1} />
                                <Tab label="Investors" value={2} />
                                <Tab label="Entrepreneurs" value={3} />
                            </Tabs>
                            <hr />
                        </Grid>
                    </Grid>
                    {[0, 1, 2, 3].map(item => (
                        <Typography
                            key={item}
                            component="div"
                            role="tabpanel"
                            hidden={this.state.value !== item}
                            id={`tabpanel-${item}`}
                        >
                            <Grid container justifyContent="center" spacing={3}>
                                {this.loadUsers()}
                            </Grid>

                        </Typography>
                    ))}
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
            findConnections,
            findAllUsers
        },
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(AllUsers));
