import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import React, { createContext, useContext, useMemo, useState } from "react";

type SubscriptionsContextValue = {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextValue | undefined>(undefined);

type SubscriptionsProviderProps = {
  children: React.ReactNode;
};

export const SubscriptionsProvider = ({ children }: SubscriptionsProviderProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const value = useMemo(
    () => ({
      subscriptions,
      addSubscription: (subscription: Subscription) => {
        setSubscriptions((current) => [subscription, ...current]);
      },
    }),
    [subscriptions]
  );

  return <SubscriptionsContext.Provider value={value}>{children}</SubscriptionsContext.Provider>;
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within SubscriptionsProvider");
  }
  return context;
};
