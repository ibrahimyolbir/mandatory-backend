import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { updateUsername } from './store';
import '../App.css';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      color: 'black',
      isLoggedIn: false,
    };
    this.onChange = this.onChange.bind(this);
    this.login = this.login.bind(this);
    this.handelKeyPress = this.handelKeyPress.bind(this);
  }
  handelKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.state.username.length > 12) {
        this.setState({ usernameError: "Login failed: The username must be less 12 characters." });
      } else if (this.state.username.match(/[^a-z0-9_ -]/i)) {
        this.setState({ usernameError: "Login failed: The username can only contain alphanumeric characters, “-”, “_” and spaces" });
      } else {
        this.setState({ isLoggedIn: true, usernameError: "" });
        updateUsername(this.state.username);
      }
    }

  }
  onChange(event) {
    this.setState({ username: event.target.value, usernameError: '' });
  }

  login(event) {
    event.preventDefault();

    if (this.state.username.match(/^[\d\s]+$/g)) {
      this.setState({ usernameError: "Login failed: The username can only contain alphanumeric characters, “-”, “_” and spaces" });
    }
    else if (this.state.username.length > 12) {
      this.setState({ usernameError: "Login failed: The username must be less 12 characters." });
    }
    else {
      this.setState({ isLoggedIn: true, usernameError: "" });
      updateUsername(this.state.username);
    }
  }

  render() {
    if (this.state.isLoggedIn === true) {
      return <Redirect to='/room/:id' />
    }
    return (
      <div className="login__page" >
        <form>
          <h3>Whats your Username? </h3>
          <input
            type="text"
            placeholder="Username"
            onChange={this.onChange}
            value={this.state.username}
            onKeyDown={this.props.handelKeyPress}
            className="form-control login-input" />
          <button className='login-button' type='submit' onClick={this.login}>Login</button>
          <span className="error">{this.state.usernameError}
          </span>
        </form>

      </div>
    );
  }
}

export default Login