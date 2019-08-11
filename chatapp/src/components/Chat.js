import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { username$, removeUsername } from './store';
import Rooms from './Rooms';
import '../App.css';
const uuidv1 = require("uuid/v1");


class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: username$.value,
            usernameError: "",
            message: '',
            messages: [],
            users: [],
            roomName: '',
            isLoggedIn: true,
            showMenu: false,
        };

        this.sendMessage = this.sendMessage.bind(this);
        this.logoutButton = this.logoutButton.bind(this);
        this.showMenu = this.showMenu.bind(this);

    }
    //---------------------------- End Of Constructor   ---------------------------------//

    componentDidMount() {

        this.socket = socketIOClient('http://localhost:8091');

        this.socket.on("new_message", (message) => {
            console.log(message);
            if (!this.state.users.includes(message.msg.user)) {
                this.setState({ users: [...this.state.users, message.msg.user] });
            }

            this.setState({
                messages: [...this.state.messages, message.msg],
                
            })

        })
        this.updateMessages(this.props.match.params.id);
    }
    
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket = null;
    }

    componentWillReceiveProps(nextProps) {
        this.updateMessages(nextProps.match.params.id);
    }

    //---------------------------- Update Messages  ---------------------------------//

    updateMessages(id) {
        this.setState({ messages: [] });
        axios.get(`http://localhost:8091/room/${id}`)
            .then((response) => {
                let userList = [];
                let messages = response.data.room.msg;
                for (let message of messages) {
                  if (!userList.includes(message.user)) {
                    userList.push(message.user);
                  }
                }
                
                this.setState({ users: userList, messages: response.data.room.msg,roomName:response.data.room.name });
                console.log(response.data.room.msg);
                console.log(userList);
                this.scrollToBottom();
            });
            
    }

    //---------------------------- Send Messages  ---------------------------------//

    sendMessage = (event) => {
        event.preventDefault();
        
        const timestamp = () => {return  new Date().toLocaleString("sv-SE")}
        const id = this.props.match.params.id;
        const user = this.state.username
        const name = this.state.roomName;
        const message = this.state.message
        const unId = uuidv1();
        
			let data = {
				id,
				name,
				msg: 
					{user: user, message: message,unId:unId,timestamp:timestamp()}
            }

            this.scrollToBottom();
			this.socket.emit('new_message', data)
            this.state.message = "";
    }


    //---------------------------- Logout  ---------------------------------//

    logoutButton(e) {
        this.setState({ isLoggedIn: false });
        this.showMenu();
        removeUsername();
    }

    //---------------------------- DropDown  ---------------------------------//

    showMenu() {
        if (!this.state.popupVisible) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            popupVisible: !prevState.popupVisible,
        }));
    }
    //--------------------------- Scroll To Bottom  ---------------------------//
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        if (!username$.value) {
            return <Redirect to='/' />
        }        
        const messages = this.state.messages
        const users = this.state.users
        return (
            <div className="container-fluid h-100">
                <Rooms />
                <div className="row justify-content-center h-100">
                    <div className="col-md-12 col-xl-12 chat">
                        <div className="card card-message" >
                            <div className="card-header msg_head">
                                <div className="d-flex bd-highlight">
                                    <div className="user_info">
                                        <span> Loggad in as: {this.state.username} </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body msg_card_body" id="card-bodyId">
                                <ul className="msg_cotainer">
                                    {messages.map((m) => {
                                        return (
                                            <li
                                                className={`message ${
                                                    m.user === this.state.username ? "current-user" : "other-users"
                                                    }`}
                                                key={m.unId}>
                                                <p className="name__letter">{m.user.charAt(0)}</p>
                                                <div className="chat__text">
                                                    <span className="user__name" >{m.user}</span>
                                                    <span className="message__content">{m.message}</span>
                                                    <span className="msg_time">{m.timestamp}</span>

                                                </div>
                                            </li>

                                        );
                                    })}
                                <div style={{ float: "left", clear: "both" }}
                                        ref={(el) => { this.messagesEnd = el; }}>
                                    </div>    
                                </ul>
                                
                            </div>
                            <div className="card-footer">
                                <div className="input-group">
                                    <div className="input-group-append">
                                        <button type="button" className="input-group-text attach_btn" >
                                            <i className="far fa-smile"></i></button>
                                    </div>
                                    <form onSubmit={this.sendMessage}>
                                        <input
                                            type="text"
                                            required
                                            value={this.state.message}
                                            onChange={ev => this.setState({ message: ev.target.value })}
                                            style={{ top: 0, left: 0 }}
                                            maxLength={200}
                                            className="type_msg form-control "
                                            placeholder="Type your message..."></input>
                                        <div className="input-group-append">
                                            <button type='submit' className="input-group-text send_btn"><i className="fas fa-location-arrow"></i></button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row justify-content-center h-100">
                    <div className="col-md-12 col-xl-12 chat">
                        <div className="card card-users" >
                            <div className="card-header msg_head">
                                <div className="d-flex bd-highlight">
                                    <div className="user_info">
                                        <span>Users</span>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <div className="popover-container" ref={node => { this.node = node; }}>
                                        <button className="dropbtn" onClick={this.showMenu}><i className="fas fa-ellipsis-v"></i></button>
                                        {this.state.popupVisible && (
                                            <div
                                                className="popover"
                                            ><div className="dropdown-content">
                                                    <a href="#"><i className="fas fa-home"></i>   Home</a>
                                                    <a href="#"><i className="fas fa-cogs"></i>  Settings</a>
                                                    <a onClick={this.logoutButton} className="logout__button"><i className="fas fa-sign-out-alt"></i>  Logout [{this.state.username}]</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body msg_card_body" id="card-bodyId">
                                <div className='users-container'>
                                    <ul className='users-list'>
                                        {users.map(user => {
                                            return <li className='user-list-item' key={user}>{user}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="card-footer" style={{ height: 84 }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Chat;
