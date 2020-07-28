import {
  CREATE_HOLDING, 
  UPDATE_HOLDING, 
  DELETE_HOLDING,
  UPDATE_THEME,
  UPDATE_DISPLAY_NAME,
  UPDATE_USER_EMAIL
} from 'services/graphql/mutations'

import {
  CURRENT_USER,
  ALL_INSTRUMENTS,
  SEARCH_INSTRUMENTS
} from 'services/graphql/queries'

import {
  SUBSCRIBE_CURRENT_USER
} from 'services/graphql/subscriptions'

export const graphqlService = {
  CREATE_HOLDING, 
  UPDATE_HOLDING, 
  DELETE_HOLDING,
  UPDATE_THEME,
  UPDATE_DISPLAY_NAME,
  UPDATE_USER_EMAIL,
  CURRENT_USER,
  ALL_INSTRUMENTS,
  SEARCH_INSTRUMENTS,
  SUBSCRIBE_CURRENT_USER
};
