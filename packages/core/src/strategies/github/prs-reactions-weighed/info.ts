import { StrategyInfo } from '../../../types';

export const strategyInfo: StrategyInfo = {
    "name": "Github Contributors - PRs Weighted By Reactions",
    "description": "Strategy description, including description regarding the configurable parameters and the strategy logic",
    "exapmle_Params": {
        "repositories": [
            {
                "owner": "ethereum",
                "repo": "go-ethereum"
            }
        ],
        "timeRange": {
            "start": 1651400578,
            "end": 1653215165
        }
    }
}