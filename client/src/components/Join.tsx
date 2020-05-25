import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { AppContext } from 'context/AppContext';
import { userService } from 'services/userService';
import { Container, Grid, Paper, Typography, Button, TextField, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { apiService } from 'services/apiService';
import { Status } from 'helpers/types';
import { gaService } from 'services/gaService';

const useStyles = makeStyles(() => ({
  join: {
    minWidth: '5rem',
    minHeight: '5rem',
  },
  gridItem: {
    alignItems: 'center',
    justify: 'center',
    margin: '0 2rem',
  },
  joinGrid: {
    alignItems: 'flex-end',
    textAlign: 'end',
  },
  button: {
    backgroundColor: 'black',
    '&:hover': {
      backgroundColor: 'black',
    },
  },
}));

type Props = {};

const Join: React.FC<Props> = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.None);

  const history = useHistory();
  const classes = useStyles();
  const appContext = useContext(AppContext);

  async function onConfirm(data: any) {
    gaService.registerSuccessEvent();
    appContext.setSignupEmail(email);
    setStatus(Status.Success);
    history.push('/login');
  }

  async function onError(error: any) {
    gaService.registerFailedEvent();
    setStatus(Status.Failed);
    console.info(error);
  }

  useEffect(() => {
    if (userService.isLoggedIn) {
      history.push('/dashboard');
    }
  }, [history]);

  return (
    <Container className={classes.join} maxWidth='sm'>
      <Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant='h4'>Create your account</Typography>
          </Grid>
          {status === Status.Success && (
            <Grid item xs={12} className={classes.gridItem}>
              <Alert severity='success'>
                Account created successfully! Redirecting to <Link href='/login'>Sign in page</Link>...
              </Alert>
            </Grid>
          )}
          {status === Status.Failed && (
            <Grid item xs={12} className={classes.gridItem}>
              <Alert severity='error'>Error! Account was not created, please try again</Alert>
            </Grid>
          )}
          <Grid item xs={12} className={classes.gridItem}>
            <TextField
              id='firstname'
              name='firstname'
              label='First Name'
              variant='outlined'
              fullWidth
              autoComplete='on'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <TextField
              id='lastname'
              name='lastname'
              label='Last Name'
              variant='outlined'
              fullWidth
              autoComplete='on'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <TextField
              id='email'
              name='email'
              label='Email Address'
              variant='outlined'
              fullWidth
              autoComplete='on'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <TextField
              id='password'
              name='password'
              label='Choose Password'
              variant='outlined'
              fullWidth
              value={password}
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <Grid container>
              <Grid item xs={6}>
                <Button onClick={() => history.push('/login')}>Log in</Button>
              </Grid>
              <Grid item className={classes.joinGrid} xs={6}>
                <Mutation
                  mutation={apiService.registerMutation}
                  variables={{ firstName, lastName, email, password }}
                  onCompleted={(data: any) => onConfirm(data)}
                  onError={(error: any) => onError(error)}>
                  {(mutation: any) => (
                    <Button className={classes.button} variant='contained' color='primary' onClick={mutation}>
                      Create Account
                    </Button>
                  )}
                </Mutation>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Join;