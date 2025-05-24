import React from "react";

const Card = ({ children }) => {
    return (
        <div className="bg-white shadow-sm rounded-sm p-4">
            {children}
        </div>
    );
}

export { Card };