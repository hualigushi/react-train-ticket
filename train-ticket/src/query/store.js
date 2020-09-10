import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'
import {h0} from '../common/fp'
import { ORDER_DEPART } from './constant'

export default createStore (
    combineReducers(reducers),
    {
        from: null,
        to: null,
        departDate: h0(Date.now()),
        highSpeed: false,
        trainList: [],
        orederType: ORDER_DEPART,
        onlyTickets: false,
        ticketTypes: [],
        checkedTicketTypes: {},
        trainTypes: [],
        checkedTrainType: {},
        departStations: [],
        checkedDepartStation: {},
        arriveStations: [],
        checkedArriveStation: {},
        departTimeStart: 0,
        departTimeEnd: 24,
        arriveTimeStart: 0,
        arriveTimeEnd: 24,
        isFilterVisible: false,
        searchParsed: false
    },
    applyMiddleware(thunk)
)