import React, { PureComponent } from "react";
import {
  Container,
  Popover,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  MenuItem,
  Slider,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import csc from "country-state-city";
/* filter users by their location or interest */
export default class Filter extends PureComponent {
  state = {
    categories: [
      {
        name: "Agriculture & Related",
        value: false,
      },
      {
        name: "Construction",
        value: false,
      },
      {
        name: "Consulting & Professional Services",
        value: false,
      },
      {
        name: "Education",
        value: false,
      },
      {
        name: "Energy",
        value: false,
      },
      {
        name: "Financial",
        value: false,
      },
      {
        name: "Health Care & Biotechnology",
        value: false,
      },
      {
        name: "Information Technology & Telecommunication Services",
        value: false,
      },
      {
        name: "Manufacturing & Mining",
        value: false,
      },
      {
        name: "Real Estate & Hospitality ",
        value: false,
      },
      {
        name: "Renewables & Cleantech",
        value: false,
      },
      {
        name: "Retail & E-commerce",
        value: false,
      },
      {
        name: "Transportation",
        value: false,
      },
      {
        name: "Other",
        value: false,
      },
    ],
    anchorEl: null,
    open: false,
    seletedFilterTab: 0,
    id: undefined,
    country: "",
    state: "",
    city: "",
    collaboration: 0,
  };
  handleFilterMenuOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: true,
      id: "filter-popover",
    });
  };
  handleFilterMenuClose = () => {
    this.setState({ anchorEl: null, open: false, id: undefined });
  };
  handleTabChange = (event, newValue) => {
    this.setState({ seletedFilterTab: newValue });
  };
  handleCategoryChange = (index) => (event) => {
    const categories = [...this.state.categories];
    categories[index].value = event.target.checked;
    this.setState({ categories });
  };
  clearAll = () => {
    const categories = [
      {
        name: "Agriculture",
        value: false,
      },
      {
        name: "Education",
        value: false,
      },
      {
        name: "Finance",
        value: false,
      },
      {
        name: "Information Technology",
        value: false,
      },
      {
        name: "Telecommunication",
        value: false,
      },
      {
        name: "Other",
        value: false,
      },
    ];

    this.setState({
      categories,
      country: "",
      state: "",
      city: "",
      collaboration: 0,
    });
    this.setState({ anchorEl: null, open: false, id: undefined });
    this.props.applyFilter(null);
  };
  applyChanges = () => {
    this.setState({ anchorEl: null, open: false, id: undefined });
    const categories = [];
    for (let cat of this.state.categories) {
      if (cat.value) {
        categories.push(cat.name);
      }
    }
    const data = {
      categories,
      collaboration: this.state.collaboration,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
    };
    this.props.applyFilter(data);
  };
  handleGeographyChange = (key, value) => {
    this.setState({ [key]: value });
  };
  handleCollaborationChange = (event, newValue) => {
    this.setState({ collaboration: newValue });
  };
  showCategories = () => {
    return (
      <div className="categories-tab">
        <FormControl component="fieldset">
          <FormGroup className="categories-tab-list">
            {this.state.categories.map((cat, index) => (
              <FormControlLabel
                key={cat.name}
                control={
                  <Checkbox
                    color="primary"
                    checked={cat.value}
                    onChange={this.handleCategoryChange(index)}
                    value={cat.value}
                  />
                }
                label={cat.name}
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
    );
  };
  showGeography = () => {
    return (
      <div className="geography-tab">
        <TextField
          variant="outlined"
          id="country"
          label="Country "
          name="country"
          className="country"
          select
          value={this.state.country}
          onChange={(event) =>
            this.handleGeographyChange("country", event.target.value)
          }
        >
          {csc.getAllCountries().map((country) => (
            <MenuItem key={country.id} value={country.id}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          id="state"
          label="State "
          name="state"
          className="state"
          select
          value={this.state.state}
          onChange={(event) =>
            this.handleGeographyChange("state", event.target.value)
          }
          disabled={!this.state.country}
        >
          {csc.getStatesOfCountry(this.state.country).map((country) => (
            <MenuItem key={country.id} value={country.id}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          id="city"
          label="City "
          name="city"
          className="city"
          select
          value={this.state.city}
          onChange={(event) =>
            this.handleGeographyChange("city", event.target.value)
          }
          disabled={!this.state.state}
        >
          {csc.getCitiesOfState(this.state.state).map((country) => (
            <MenuItem key={country.id} value={country.id}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  };
  showCollaborations = () => {
    return (
      <div className="collaboration-tab">
        <Typography id="range-slider" className="text-center" gutterBottom>
          Collaboration
        </Typography>
        <Slider
          value={this.state.collaboration}
          min={0}
          step={1}
          max={50}
          valueLabelFormat={() => "> " + this.state.collaboration}
          onChange={this.handleCollaborationChange}
          valueLabelDisplay="on"
          className="collaboration-range-slider"
          aria-labelledby="non-linear-slider"
        />
      </div>
    );
  };
  render() {
    return (
      <Container className="filter">
        <Button
          variant="outlined"
          color="default"
          aria-controls="filter-menu"
          className="no-outline"
          onClick={this.handleFilterMenuOpen}
        >
          <FilterListIcon className="mr-2" /> Filters
        </Button>
        <Popover
          id={this.state.id}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleFilterMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          className="filter-section"
        >
          <Typography component="div" className="filter-typography">
            <Tabs
              orientation="vertical"
              value={this.state.seletedFilterTab}
              onChange={this.handleTabChange}
              aria-label="filter tabs"
              className="filter-tabs"
            >
              <Tab
                label="Industries"
                id="categiries"
                aria-controls="categiries"
              />
              <Tab label="Geography" id="geography" aria-controls="geography" />
              {/* <Tab
                label="Collaborations"
                id="collaboration"
                aria-controls="collaboration"
              /> */}
            </Tabs>
            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.seletedFilterTab !== 0}
              id="categories"
              aria-labelledby="categories"
            >
              {this.showCategories()}
            </Typography>
            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.seletedFilterTab !== 1}
              id="geography"
              aria-labelledby="geography"
            >
              {this.showGeography()}
            </Typography>
            <Typography
              component="div"
              role="tabpanel"
              hidden={this.state.seletedFilterTab !== 2}
              id="collaboration"
              aria-labelledby="collaboration"
            >
              {this.showCollaborations()}
            </Typography>
          </Typography>
          <Divider />
          <div className="m-3 text-right">
            <Button
              color="default"
              className="no-outline mr-1"
              onClick={this.clearAll}
            >
              Clear All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="no-outline"
              onClick={this.applyChanges}
            >
              Apply
            </Button>
          </div>
        </Popover>
      </Container>
    );
  }
}
