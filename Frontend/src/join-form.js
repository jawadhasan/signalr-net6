import React, { useState } from "react";

const JoinForm = (props) => {

    const [user, setUser] = useState(props.user);

    const onChange = (e) => {
        setUser({ ...user, [e.target.id]: e.target.value });
      };

    return (
        <div className="form-inline">
        
            <input
                required
                type="text"
                className="form-control"
                placeholder="Enter Nick Name"
                id="nick"
                value={user.nick}
                onChange={onChange} />

            <button className="btn btn-primary" data-bind="enable: nick().length > 0" onClick={()=>{props.onJoin(user)}}>Join</button>
        </div>
    );
}

export default JoinForm;