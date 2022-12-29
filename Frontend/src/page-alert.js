import React from "react";
const PageAlert = ({message}) => {
    return (  
        <div className="alert alert-primary" role="alert">
            {message}
        </div>
    );
}
 
export default PageAlert;