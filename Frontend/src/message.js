import React from 'react';

const Message = (props) => (
    <div>
        <p>
         <span className="fa fa-clock"></span>
         <span className="date" data-bind="text: displayDate">{props.displayDate}</span> &nbsp;
        <strong>{props.user}</strong>&gt;  {props.message}
        </p>
    </div>
);

export default Message;