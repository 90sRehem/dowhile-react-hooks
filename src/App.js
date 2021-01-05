import React, { useState, useEffect, useReducer } from "react";

import { fetchGithubUser } from './userService'

import { UserForm } from "./components/UserForm";
import { UserFalback } from './components/UserFallback'
import { UserView } from './components/UserView'

const REQUEST_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

const userReducer = (state, action) => {
  switch (action.type) {
    case REQUEST_STATUS.PENDING:
      return {
        status: REQUEST_STATUS.PENDING,
        user: null,
        error: null
      }

    case REQUEST_STATUS.RESOLVED:
      return {
        status: REQUEST_STATUS.RESOLVED,
        user: action.user,
        error: null
      }

    case REQUEST_STATUS.REJECTED:
      return {
        status: REQUEST_STATUS.REJECTED,
        user: null,
        error: action.error
      }

    default:
      throw Error(`Unhandled status: ${action.type}`)
  }
}

const UserInfo = ({ userName }) => {
  // -- PASSO 1 --
  // const [user, setUser] = useState(null);
  // const [error, setError] = useState(null);
  // const [status, setStatus] = useState('idle');

  // -- PASSO 2 --
  // const [state, setState] = useState({
  //   status: userName ? 'pendding' : 'idle',
  //   user: null,
  //   error: null
  // });

  const initialValue = {
    status: userName ? REQUEST_STATUS.PENDING : REQUEST_STATUS.IDLE,
    user: null,
    error: null
  }

  const [state, dispatch] = useReducer(userReducer, initialValue);

  // -- PASSO 2/3 --
  const { status, user, error } = state

  useEffect(() => {
    if (!userName) return
    // -- PASSO 1 --
    // setUser(null)
    // setError(null)
    // setStatus('pending')

    // -- PASSO 2 --
    // setState({ status: 'pendding' })

    // -- PASSO 3 --
    dispatch({ type: REQUEST_STATUS.PENDING })

    fetchGithubUser(userName).then(
      (userData) => {
        // -- PASSO 1 --
        // setUser(userData)
        // setStatus('resolved')

        // -- PASSO 2 --
        // setState({ status: 'resolved', user: userData })

        // -- PASSO 3 --
        dispatch({ type: REQUEST_STATUS.RESOLVED, user: userData })
      },
      (error) => {
        // -- PASSO 1 --
        // setError(error)
        // setStatus('rejected')

        // -- PASSO 2 --
        // setState({ status: 'rejected', error })

        // -- PASSO 3 --
        dispatch({ type: REQUEST_STATUS.REJECTED, error: error })
      }
    );
  }, [userName]);

  // -- PASSO 1 --
  // if (error) {
  //   return (
  //     <div>
  //       There was an error
  //       <pre style={{ whiteSpace: 'normal' }}>{error}</pre>
  //     </div>)
  // }
  // else if (!userName) {
  //   return "Submit user"
  // } else if (!user) {
  //   return <UserFalback userName={userName} />
  // } else {
  //   return <UserView user={user} />
  // }

  // -- PASSO 2 --
  switch (status) {
    case REQUEST_STATUS.IDLE:
      return "Submit user"

    case REQUEST_STATUS.PENDING:
      return <UserFalback userName={userName} />

    case REQUEST_STATUS.RESOLVED:
      return <UserView user={user} />

    case REQUEST_STATUS.REJECTED:
      return (
        <div>
          There was an error
          <pre style={{ whiteSpace: 'normal' }}>{error}</pre>
        </div>
      )

    default:
      throw Error(`Unhandled status: ${status}`)
  }
};

const UserSection = ({ onSelect, userName }) => (
  <div>
    <div className="flex justify-center ">
      <UserInfo userName={userName} />
    </div>
  </div>
);

const App = () => {
  const [userName, setUserName] = React.useState(null);
  const handleSubmit = (newUserName) => setUserName(newUserName);
  const handleSelect = (newUserName) => setUserName(newUserName);

  return (
    <div>
      <UserForm userName={userName} onSubmit={handleSubmit} />
      <hr />
      <div className="m-4">
        <UserSection onSelect={handleSelect} userName={userName} />
      </div>
    </div>
  );
};

export default App;
