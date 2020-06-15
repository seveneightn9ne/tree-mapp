import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppLoading } from "expo";

import MapPage from "./src/pages/MapPage";
import store from "./src/redux/store";
import loadInitial from "./src/redux/thunks/loadInitial";

const Stack = createStackNavigator();

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: null | (() => void) = null;
    const removeEffect = () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
    (async () => {
      if (appLoading && !store.getState().ui.loaded) {
        unsubscribe = store.subscribe(() => {
          const state = store.getState();
          if (state.ui.loaded) {
            setAppLoading(false);
            unsubscribe && unsubscribe();
          }
        });
        await store.dispatch(loadInitial());
        setAppLoading(false);
      }
    })();
    return removeEffect;
  });

  if (appLoading) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Map" component={MapPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
