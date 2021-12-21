import React, {useContext} from "react";

export const useInitContext = <T>(context: React.Context<T | null>) => {
  const contextData = useContext(context);
  if (!contextData) {
    throw new Error('Not init context');
  }
  return contextData;
}