import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';



function Rooms() {
    const [rooms, updateRooms] = useState([]);
    const [newRoom, updateNewRoom] = useState("");

    useEffect(() => {
        getRooms();
    }, []);


    const getRooms = () => {
        return axios.get('http://localhost:8091/rooms')
            .then(response => {
                updateRooms(response.data.rooms);
                
                
            })
            .catch(error => console.log(error));
    }
    const createRoom = (event) => {
        event.preventDefault(); 
        axios.post('http://localhost:8091/rooms', {
            name: newRoom
        })
            .then(response => {
                updateRooms(response.data.rooms);
                updateNewRoom("");
               
            })
            .catch(error => console.log(error));
    }

    const removeRoom = (id) => {
        axios.delete(`http://localhost:8091/room/${id}`)
            .then(() => {
                getRooms();
            })
    }

    return (
        <div className="row justify-content-center h-100">
            <div className="col-md-12 col-xl-12 chat">
                <div className="card card-rooms" >
                    <div className="card-header msg_head">
                        <div className="d-flex bd-highlight">
                            <div className="user_info">
                                <span>Rooms</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body msg_card_body" id="card-bodyId">
                        <div className='navbar-menu-container'>
                            <ul className='navbar-menu'>
                                {rooms.map(room => {
                                
                                
                                    return <li className='room' key={room.room.id}>
                                        <Link to={`/room/${room.room.id}`}>{room.room.name}</Link>
                                        <button className='remove-room-button' onClick={() => removeRoom(room.room.id)}><i className="fas fa-trash"></i></button>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="input-group">
                            <form onSubmit={createRoom}>
                                <input
                                    type="text"
                                    required
                                    value={newRoom}
                                    onChange={e => updateNewRoom(e.target.value)}
                                    style={{ top: 0, left: 0 }}
                                    spellCheck='false'
                                    maxLength={10}
                                    className="type_msg form-control form-control-rooms " 
                                    placeholder="Create a room..."></input>
                                <div className="input-group-append">
                                    <button type='submit' className="input-group-text send_btn"><i className="fas fa-plus"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Rooms;
