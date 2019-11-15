import React, {Component} from "react";
import "./OpenedSurveys.scss";
import Input from '../../components/Input/Input'
import Icon from '../../components/Icon/Icon';
import Card from "../../components/Card/Card";
import { CARD_TYPE } from "../../utils/constats"
import { connect } from 'react-redux';
import * as surveysActions from '../../utils/redux/actions/surveysActions'

class OpenedSurveys extends Component {
  state = {
    searchValue: '',
    surveysList: []
  };

  componentDidMount() {
    const { fetchSurveyList } = this.props;
    fetchSurveyList();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.surveysList !== props.surveysList) {

      const surveysList = props.surveysList.filter(f => new Date(f.endTime).getTime() > new Date().getTime());
      return {
        surveysList,
      };
    }
    return null;
  }

  setSearchVal = (val) => {
    this.setState({
      searchValue: val,
    });
  };

  onChangeToggle = async (id, isChecked) => {
    const { toggleSurvey } = this.props;

    await toggleSurvey(id, isChecked);
  };

  render() {
    const { searchValue, surveysList } = this.state;

    const surveys = surveysList
      .filter( f => f.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 );
    return (
      <div className="content opened-surveys">
        <div className="page-title">
          <div className="name-box">
            <span>Opened Surveys</span>
          </div>
          <form className="search-documents">
            <Input
              className="search-input"
              type="text"
              value={searchValue}
              placeholder="Find survey which you need"
              onChange={this.setSearchVal}
            />
            <Icon icon="search" className="search-bt" />
          </form>
        </div>
        <div className="card-list">
          {
            surveys.map(({ fileId, startTime, endTime, title, type, totalreplied, city, active, surveyId}, index) => (
              <Card
                key={index}
                image={fileId[0]}
                date={{start: startTime, end: endTime}}
                description={title}
                city={city}
                surveyType={type}
                counter={Number(totalreplied)}
                active={active}
                id={surveyId}
                onChangeToggle={this.onChangeToggle}
                type={CARD_TYPE.OPENED_SURVEYS}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  cards: state.activeSurveys,
  surveysList: state.surveysList
});

const mapDispatchToProps = {
  ...surveysActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenedSurveys);
