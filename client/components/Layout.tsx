import React, { ReactNode } from 'react'
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TopHeader from 'components/Header';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    padding: '1rem',
    justifyContent: 'center',
  },
}));

type Props = {
  children?: ReactNode
  title?: string
}

export default function Layout(props: Props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TopHeader />
      <Container maxWidth="xl" className={classes.root}>{props.children}</Container>
    </React.Fragment>
  );
};
