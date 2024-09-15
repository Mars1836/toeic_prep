import StoreProvider from "@/app/StoreProvider";

export function withProvider(Component) {
  return function ProviderWrappedComponent(props) {
    return (
      <StoreProvider>
        <Component {...props} />
      </StoreProvider>
    );
  };
}

// Alternative wrapper for consistency with HOC naming convention
export function providerWrapper(Component) {
  return withProvider(Component);
}
