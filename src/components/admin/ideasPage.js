import React, { PureComponent } from "react";
import Page from "../page";
import PageSpinner from "../PageSpinner";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { findAllIdeas, deleteIdea } from '../../store/actions/pitch_action';
import { Grid, Snackbar, CircularProgress, Backdrop } from '@material-ui/core';
import IdeaCard from '../Idea/IdeaCard';
import AlertDialog from './alertDialog';

/* show all idea to admin, admin can delete any idea */
class Ideas extends PureComponent {
    state = {
        loading: true,
        askConfirmation: false,
        selectedPitchId: null,
        backdrop: false,
        snackbar: {
            open: false,
            title: "",
            message: "",
            level: ""
        }
    }
    async componentDidMount() {
        if (!this.props.Idea.ideas) {
            await this.props.findAllIdeas();
        }
        this.setState({ loading: false });
    }
    openConfirmationDialog = (pitchId) => {
        this.setState({
            askConfirmation: true,
            selectedPitchId: pitchId
        })
    }
    handleDialogClose = async (isDelete) => {
        if (isDelete) {
            this.setState({ backdrop: true });
            await this.props.deleteIdea(this.state.selectedPitchId);
        }
        this.setState({
            backdrop: false,
            askConfirmation: false,
            selectedPitchId: null
        });
    }
    render() {
        if (this.state.loading) {
            return <PageSpinner />
        }
        return <Page className="DashboardPage">
            <Grid container justifyContent="space-evenly">
                {this.props.Idea.ideas.length > 0 ? (
                    this.props.Idea.ideas.map(idea => (
                        <Grid item key={idea.id} className="mb-3 mr-2">
                            <IdeaCard idea={idea} delete={this.openConfirmationDialog} />
                        </Grid>
                    ))
                ) : (
                        <Grid item>No Pitch Found</Grid>
                    )}
            </Grid>
            {this.addSnackBar()}{this.addBackdrop()}
            {this.state.askConfirmation && <AlertDialog show={this.state.askConfirmation} handleClose={this.handleDialogClose} message="Do you want to delete this Idea" />}
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
        Idea: state.Idea
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            findAllIdeas,
            deleteIdea
        },
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Ideas));
