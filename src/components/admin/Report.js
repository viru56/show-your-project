import React, { Component } from "react";
import Page from "../page";
import PageSpinner from "../PageSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container
} from "@material-ui/core";
import { getUsersReport } from "../../store/actions/user_action";
import { getIdeasReport } from "../../store/actions/pitch_action";
import { withRouter } from "react-router-dom";

/* show all activity to admin */
class Report extends Component {
  state = {
    reports: [],
    loading: true
  };
  async componentDidMount() {
    const results = await Promise.all([getUsersReport(),getIdeasReport()])
    // const usersReport = await getUsersReport();
    // const ideasReport = await getIdeasReport();
    this.setState({
      reports: [...results[0], ...results[1]],
      loading: false
    });
  }
  render() {
    if (this.state.loading) {
      return <PageSpinner />;
    }
    return (
      <Page className="DashboardPage">
        <Container>
          <TableContainer component={Paper}>
            <Table
              className="table"
              style={{ marginBottom: 0 }}
              aria-label="table header"
            >
              <TableHead style={{ backgroundColor: "#5a5b5a" }}>
                <TableRow>
                  <TableCell
                    style={{ color: "#fff", fontSize: 14, padding: 16 }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    style={{ color: "#fff", fontSize: 14, padding: 16 }}
                  >
                    Overall
                  </TableCell>
                  <TableCell
                    style={{ color: "#fff", fontSize: 14, padding: 16 }}
                  >
                    Entrepreneurs
                  </TableCell>
                  <TableCell
                    style={{ color: "#fff", fontSize: 14, padding: 16 }}
                  >
                    Experts{" "}
                  </TableCell>
                  <TableCell
                    style={{ color: "#fff", fontSize: 14, padding: 16 }}
                  >
                    Investors
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.reports.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ fontSize: 14, padding: 16 }}>
                      {row.title}
                    </TableCell>
                    <TableCell style={{ fontSize: 14, padding: 16 }}>
                      {row.overall}
                    </TableCell>
                    <TableCell style={{ fontSize: 14, padding: 16 }}>
                      {row.entrepreneurs}
                    </TableCell>
                    <TableCell style={{ fontSize: 14, padding: 16 }}>
                      {row.experts}
                    </TableCell>
                    <TableCell style={{ fontSize: 14, padding: 16 }}>
                      {row.investors}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Page>
    );
  }
}

export default withRouter(Report);
