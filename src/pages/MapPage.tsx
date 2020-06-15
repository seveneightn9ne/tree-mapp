import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Region, PROVIDER_GOOGLE } from "react-native-maps";
import { connect } from "react-redux";
import * as Location from "expo-location";

import { TMState } from "../redux/types";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const mapStateToProps = (state: TMState) => ({
  //fontLoaded: state.ui.fontLoaded,
});
type Props = ReturnType<typeof mapStateToProps>;

function MapPage() {
  const [location, setLocation] = useState<Location.LocationData | null>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [hasPanned, setHasPanned] = useState(false);
  const [isWatchingPosition, setIsWatchingPosition] = useState(false);

  const initialRegion = {
    latitude: location ? location.coords.latitude : 40.7307786,
    longitude: location ? location.coords.longitude : -73.9951143,
    latitudeDelta: location ? 0.002 : 0.02,
    longitudeDelta: location ? 0.0005 : 0.05,
  };

  const recenter = () => {
    setRegion(initialRegion);
    setHasPanned(false);
  };

  useEffect(() => {
    let removeSubscription: (() => void) | null = null;
    const removeEffect = () => {
      if (removeSubscription) {
        removeSubscription();
      }
    };
    (async () => {
      setIsWatchingPosition(true);
      if (!isWatchingPosition) {
        console.log("Will watch position");
        try {
          const { status } = await Location.requestPermissionsAsync();
          if (status !== "granted") {
            console.log("Permission to access location was denied");
          }

          console.log("Setting initial location");
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          setLocation(location);
          recenter();
          console.log("Set initial location");

          const { remove } = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Highest,
              timeInterval: 5000,
            },
            (location) => {
              // console.log("got location");
              setLocation(location);
              if (!hasPanned) {
                recenter();
              }
            }
          );
          console.log("Now watching position");
          removeSubscription = remove;

          return removeSubscription;
        } catch (e) {
          console.warn("Unable to get location", e);
        }
      }
    })();
    return removeEffect;
  });

  const onPan = () => setHasPanned(true);

  const recenterOverlay = location ? (
    <View style={styles.recenterOverlayOuter}>
      <TouchableWithoutFeedback onPress={recenter}>
        <View style={styles.recenterOverlay}>
          <Text style={styles.recenterOverlayText}>gps_fixed</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  ) : null;
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        customMapStyle={mapStyle}
        initialRegion={initialRegion}
        region={region}
        showsUserLocation={true}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsIndoors={false}
        showsTraffic={false}
        onPanDrag={onPan}
      ></MapView>
      {recenterOverlay}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  recenterOverlayOuter: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
  },
  recenterOverlay: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderTopLeftRadius: 24,
    paddingTop: 5,
    paddingLeft: 5,
  },
  recenterOverlayText: {
    fontFamily: "material-icons",
    fontSize: 32,
    color: "#666",
    textAlign: "center",
    textAlignVertical: "center",
    height: "100%",
  },
});

// https://mapstyle.withgoogle.com/
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

export default connect(mapStateToProps)(MapPage);
