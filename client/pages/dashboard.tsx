import React, { useEffect, useContext, useState } from 'react'
import Router from 'next/router'
import { useMutation } from '@apollo/client'
import { Mutation } from '@apollo/react-components'
import { Grid, Paper, Typography, TextField, Button, CircularProgress, Collapse } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import NumberFormat from 'react-number-format'
import Layout from 'components/Layout/LoggedInLayout'
import StockCharts from 'components/StockChart'
import SearchStock from 'components/SearchStock'
import HoldingView from 'components/HoldingView'
import { withApollo } from 'components/withApollo'
import NotificationComponent, { Notification } from 'components/Notification'
import { AppContext } from 'context/AppContext'
import { graphqlService } from 'services/graphql'
import { gaService } from 'services/gaService'
import { userService } from 'services/userService'
import { initApolloClient } from 'services/apolloService'
import { Instrument, Holding } from 'helpers/types'
import { isNumeric } from 'helpers/misc'

const useStyles = makeStyles(() => ({
  paper: {
    padding: '1rem',
    flex: '1 0 auto',
    marginBottom: '1.5rem',
  },
  flex: {
    display: 'flex',
  },
  welcome: {
    padding: '1rem 0 0 1rem !important',
  },
  welcomeText: {
    padding: '0',
  },
  subtitle: {
    paddingBottom: '1rem',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'black',
    '&:hover': {
      backgroundColor: 'black',
    },
  },
  loading: {
    color: 'white',
  },
  collapse: {
    marginBottom: '1rem',
  },
  holdings: {
    paddingBottom: '1rem',
  },
  padding: {
    paddingBottom: '1rem'
  }
}))

function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[] | null>(null)
  const [totalValue, setTotalValue] = useState<number | null>(null)
  const [searchInstrument, setSearchInstrument] = useState<Instrument | null>(null)
  const [instrumentToAdd, setInstrumentToAdd] = useState<Instrument | null>(null)
  const [instrumentIdToAdd, setInstrumentIdToAdd] = useState<number | null>(null)
  const [quantityToAdd, setQuantityToAdd] = useState<number | undefined>(0.0)
  const [userId, setUserId] = useState<number | null>(null)
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false })
  const [loading, setLoading] = useState<boolean>(false)

  const classes = useStyles()
  const appContext = useContext(AppContext)
  const [currentUser] = useMutation(graphqlService.CURRENT_USER)

  useEffect(() => {
    currentUser({ variables: {} }).then((response) => {
      if (response.data.currentUser.user) {
        refreshHoldings(response.data.currentUser.user.holdingsByUserId.nodes)
        setUserId(response.data.currentUser.user.id)
        appContext.setIsDarkTheme(response.data.currentUser.user.darkTheme)
        appContext.setIsLoggedIn(true)
        userService.storeUserData(response.data)
        setWelcomeMessage(`Welcome to your dashboard, ${response.data.currentUser.user.username}!`)
      } else {
        appContext.setIsLoggedIn(false)
        userService.logout()
        Router.push('/')
      }
    })
  }, [])

  const processSearch = (searchQuery: Instrument | null) => {
    if (searchQuery && searchQuery.code) {
      setSearchInstrument(searchQuery)
      appContext.setStock(searchQuery.code)
      gaService.viewStockchartEvent()
    }
  }

  const updateInstrumentToAdd = (instrument: Instrument | null) => {
    if (instrument) {
      setInstrumentToAdd(instrument)
      setInstrumentIdToAdd(instrument.id)
    }
  }

  const updateQuantityToAdd = (quantity: any) => {
    if (isNumeric(quantity) || quantity === '') {
      setQuantityToAdd(quantity)
    }
  }

  const onAddConfirm = (data: any) => {
    gaService.addInstrumentSuccessEvent()
    refreshHoldings(data.createHolding.userByUserId.holdingsByUserId.nodes)
    setInstrumentToAdd(null)
    setInstrumentIdToAdd(null)
    setQuantityToAdd(0.0)
    setNotification({ show: true, message: 'Holding added successfully', type: 'success' })
  }

  const onAddError = () => {
    gaService.addInstrumentFailedEvent()
    setNotification({ show: true, message: 'Failed to add holding', type: 'error' })
  }

  const refreshHoldings = (holdings: any) => {
    setHoldings(holdings)
    calculateTotalHoldings(holdings)
  }

  const calculateTotalHoldings = (holdings: Holding[]) => {
    let total: number = 0
    holdings.forEach((holding) => {
      total += parseFloat(holding.instrumentByInstrumentId.latestPrice) * parseFloat(holding.amount)
    })
    setTotalValue(total)
  }

  return (
    <Layout title='Dashboard | trackportfol.io'>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.welcome}>
          <Typography variant='subtitle1' className={classes.welcomeText}>
            {welcomeMessage}
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper className={classes.paper}>
            <Typography variant='h6' className={classes.holdings}>
              Your holdings
            </Typography>
            {totalValue ? (
              <React.Fragment>
              <Typography>Total portfolio value:</Typography>
              <Typography variant='button' className={classes.padding}>
                <NumberFormat
                  value={totalValue || 0}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </Typography>
              </React.Fragment>) :
              <Skeleton variant='text' />}
            {userId ? (
              holdings && holdings.length > 0 ? (
                holdings.map((holding: Holding) => {
                  return (
                    <HoldingView
                      key={holding.instrumentByInstrumentId.id}
                      amount={holding.amount}
                      code={holding.instrumentByInstrumentId.code}
                      price={holding.instrumentByInstrumentId.latestPrice}
                      userId={userId}
                      instrumentId={holding.instrumentByInstrumentId.id}
                      refreshHoldings={refreshHoldings}
                    />
                  )
                })
              ) : (
                <Typography variant='body1'>You have no holdings.</Typography>
              )
            ) : (
              <div>
                <Skeleton variant='text' />
                <Skeleton variant='text' />
                <Skeleton variant='text' />
              </div>
            )}
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper className={classes.paper}>
            <Grid item xs={12}>
              <Typography variant='h6' className={classes.subtitle}>
                Add holding
              </Typography>
            </Grid>
            <Collapse in={notification.show} className={classes.collapse}>
              <Grid item xs={12}>
                <NotificationComponent
                  message={notification.message}
                  type={notification.type}
                  onClose={() => setNotification({ show: false, type: notification.type })}
                />
              </Grid>
            </Collapse>
            {userId ? (
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <SearchStock id='add-holding-search' value={instrumentToAdd} setValue={updateInstrumentToAdd} />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <TextField
                    id='add-holding-quantity'
                    label='Quantity'
                    type='number'
                    fullWidth
                    value={quantityToAdd}
                    onChange={(e) => updateQuantityToAdd(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={12} lg={2} className={classes.flex}>
                  <Mutation
                    mutation={graphqlService.CREATE_HOLDING}
                    variables={{ userId, instrumentId: instrumentIdToAdd, amount: quantityToAdd }}
                    onCompleted={(data: any) => {
                      setLoading(false)
                      onAddConfirm(data)
                    }}
                    onError={() => {
                      setLoading(false)
                      onAddError()
                    }}>
                    {(mutation: any) => (
                      <Button
                        className={classes.button}
                        aria-label='Add Holding'
                        fullWidth
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          setLoading(true)
                          mutation()
                        }}>
                        {loading ? <CircularProgress size={24} className={classes.loading} /> : 'Add'}
                      </Button>
                    )}
                  </Mutation>
                </Grid>
              </Grid>
            ) : (
              <Skeleton variant='text' />
            )}
          </Paper>
          <Paper className={classes.paper}>
            <Grid item xs={12} className={classes.padding}>
              <Typography variant='h6' className={classes.subtitle}>
                View stockchart
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <SearchStock id='view-stockchart-search' value={searchInstrument} setValue={processSearch} />
            </Grid>
            <Grid item xs={12}>
              {appContext.stock && <StockCharts stock={appContext.stock} />}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps() {
  const client = await initApolloClient({})
  return {
    props: {
      apolloStaticCache: client.cache.extract(),
    },
  }
}

export default withApollo(Dashboard)
