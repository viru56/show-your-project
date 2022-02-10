import React, { PureComponent } from "react";
import Page from "../page";
import PageSpinner from "../PageSpinner";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { findAllUsers, deleteUser } from "../../store/actions/user_action";
import UserCard from "../Users/userCard";
import { Grid, Container, Snackbar, CircularProgress, Backdrop } from '@material-ui/core';
import AlertDialog from './alertDialog';

/* show all users to admin, admin can see their profile and delete them as well */
class AllUsers extends PureComponent {
    state = {
        loading: true,
        askConfirmation: false,
        selectedUser: null,
        backdrop: false,
        snackbar: {
            open: false,
            title: "",
            message: "",
            level: ""
        }
    }
    async componentDidMount() {
        if (!this.props.User.users) {
            await this.props.findAllUsers(this.props.User.user.email, true);
        }
        this.setState({ loading: false });
    }
    openConfirmationDialog = (user) => {
        this.setState({
            askConfirmation: true,
            selectedUser: user
        })
    }
    handleDialogClose = async (isDelete) => {
        if (isDelete) {
            this.setState({ backdrop: true });
            await this.props.deleteUser(this.state.selectedUser);
        }
        this.setState({
            backdrop: false,
            askConfirmation: false,
            selectedUser: null
        });
    }
    render() {
        if (this.state.loading) {
            return <PageSpinner />
        }
        return <Page className="DashboardPage">
            <Container>
                <Grid
                    container
                    spacing={3}
                    justifyContent="space-evenly"
                    className="mb-4"
                >
                    {this.props.User.users.map(user => {
                        return (
                            <Grid item key={user.id}>
                                <UserCard user={user} delete={this.openConfirmationDialog} />
                            </Grid>
                        );
                    })
                    }
                </Grid>
            </Container>
            {this.addSnackBar()}{this.addBackdrop()}
            {this.state.askConfirmation && <AlertDialog show={this.state.askConfirmation} handleClose={this.handleDialogClose} message="You want to permanent delete this user." />}
        </Page>
    }
    addSnackBar = () => {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                open={this.state.snackbar.open}
                autoHideDuration={2500}
                onClose={() =>
                    this.setState({
                        snackbar: { open: false, level: this.state.snackbar.level }
                    })
                }
                message={
                    <div>
                        <b>{this.state.snackbar.title}</b> <br />
                        {this.state.snackbar.message}
                    </div>
                }
                classes={{
                    root: `snackbar-${this.state.snackbar.level}`
                }}
            />
        );
    };
    addBackdrop = () => {
        return (
            <Backdrop
                open={this.state.backdrop}
                style={{ zIndex: 99999, color: "#fff" }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    };
}

const mapStateToProps = state => {
    return {
        User: state.User
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            findAllUsers,
            deleteUser
        },
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(AllUsers));