import React from 'react';
import AcheivementGrid from '../AchievementGrid/AchievementGrid';
import AchievementExplorerFilterOptions from './AchievementExplorerFilterOptions';
import AchievementFilter from '../AchievementFilter/AchievementFilter';
import MccApi from '../../services/MccApi';

interface AchievementExplorerProps {
    api: MccApi,
    Data: any[],
    LoggedIn: boolean
}

interface AchievementExplorerState {
    Filter: AchievementExplorerFilterOptions,
    ProgressionData: any[],
    LoadingProgressionData: boolean
}

export default class AchievementExplorer extends React.Component<AchievementExplorerProps, AchievementExplorerState, any>
{
    private filterStorageKey = "MccFilterState";

    public constructor(props: AchievementExplorerProps) {
        super(props);

        let storedFilterJson = window.localStorage.getItem(this.filterStorageKey);
        let initialFilter: AchievementExplorerFilterOptions;

        if(storedFilterJson != null)
        {
            initialFilter = JSON.parse(storedFilterJson);
        }
        else
        {
            initialFilter = new AchievementExplorerFilterOptions();
        }

        this.state = { Filter: initialFilter, ProgressionData:[], LoadingProgressionData: false };
    }

    handleFilterChange = (filter: AchievementExplorerFilterOptions) => {
        window.localStorage.setItem(this.filterStorageKey, JSON.stringify(filter));
        this.setState({ Filter: filter });
    }

    async componentDidUpdate(prevProps: AchievementExplorerProps) {
        if(prevProps.LoggedIn === false && this.props.LoggedIn)
        {
            this.setState({LoadingProgressionData: true});
            var progressionData = await this.props.api.getAchievements();
            this.setState({ProgressionData: progressionData, LoadingProgressionData: false});
        }
    }

    render() {
        if (!!this.props.Data && !this.state.LoadingProgressionData) {
            return (
                <div className="AchievementExplorer">
                    <AchievementFilter OnFilterChange={this.handleFilterChange} Data={this.props.Data} Filter={this.state.Filter}></AchievementFilter>
                    <AcheivementGrid Filter={this.state.Filter} Data={this.props.Data} ProgressionData={this.state.ProgressionData}></AcheivementGrid>
                </div>);
        }
        else {
            if(this.state.LoadingProgressionData)
            {
                return (<p>loading your achievement progression...</p>)
            }
            
            return (<p>loading achievements...</p>)
        }
    }
}