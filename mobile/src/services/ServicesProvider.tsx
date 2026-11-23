import { createContext, useContext, type PropsWithChildren } from "react";

import type { Services } from "./types";

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ services, children }: PropsWithChildren<{ services: Services }>) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) throw new Error("useServices must be used inside <ServicesProvider>");
  return services;
}
