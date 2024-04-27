import React, { createContext, useState, useContext, useEffect } from "react";

export const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const [currentDbKey, setCurrentDbKey] = useState("db1");
  const [isDbConnectionChanged, setIsDbConnectionChanged] = useState('');
  
  const value = {
    currentDbKey,
    setCurrentDbKey,
    isDbConnectionChanged,
    setIsDbConnectionChanged
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
