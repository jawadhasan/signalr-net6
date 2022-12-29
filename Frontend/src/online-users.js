import React from "react";

const OnlineUsers = ({users}) => {
      
    return (

        <div id="onlineusers">

            <h4 className="bg-dark text-white">Online users:  <span>{users.length}</span></h4>
            
            {users.map((usr, i) => (
                <div key={i}>
                    <span>{usr}</span>

                </div>
            ))}



        </div>
    );
}

export default OnlineUsers;