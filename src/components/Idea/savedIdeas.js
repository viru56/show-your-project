import Page from "../page";
import React, { PureComponent } from "react";
import IdeaCard from "../Idea/IdeaCard";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { findAllIdeas } from "../../store/actions/pitch_action";
import { Grid, Container, Typography } from "@material-ui/core";
import IdeaCardSkeleton from "../Idea/IdeaCardSkeleton";
/* all the favourite idea of investor/expert */
class SavedIdeasPage extends PureComponent {
  state = {
    ideas: null,
    loading: true
  };
  isComplete = false;
  componentDidMount = () => {
    this.isComplete = true;
    this.setState({ loading: true, ideas: null });
    this.getSavedIdeas();
  };
  getSavedIdeas = async () => {
    if (
      this.props.User.user.savedIdeas &&
      this.props.User.user.savedIdeas.length > 0
    ) {
      await this.props.findAllIdeas(this.props.User.user.savedIdeas);
      if (this.props.Idea.error) {
        console.log(this.props.Idea.error);
        await this.setState({ loading: false });
      } else {
        const ideas = [];
        for(const idea of this.props.Idea.ideas){
          if(this.props.User.user.savedIdeas.includes(idea.id)){
            ideas.push(idea);
          }
        }
        await this.setState({ ideas, loading: false });
      }
    } else {
      await this.setState({ loading: false, ideas: null });
    }
  };
  componentWillUnmount(){
    this.isComplete = false;
  }
  render() {
    return (
      <Page className="DashboardPage">
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {this.state.loading ? (
                <Grid container justifyContent="space-evenly" alignItems="center">
                  <Grid item>
                    <IdeaCardSkeleton />
                  </Grid>
                  <Grid item>
                    <IdeaCardSkeleton />
                  </Grid>
                  <Grid item>
                    <IdeaCardSkeleton />
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="space-evenly" alignItems="flex-start">
                  {this.state.ideas && this.state.ideas.length > 0 ? (
                    this.state.ideas.map(idea => (
                      <Grid item key={idea.id} className="mb-3">
                        <IdeaCard
                          idea={idea}
                          refreshSavedIdea={this.getSavedIdeas}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid item>
                      <Typography variant="body2">
                        You do not have any saved Idea.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}
const mapStateToProps = state => {
  return {
    User: state.User,
    Idea: state.Idea
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      findAllIdeas
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SavedIdeasPage));
