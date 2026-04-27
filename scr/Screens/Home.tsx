import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFeed } from "../Context/Context";
import Card from "../Components/Card";

const Home = () => {
  const { feed } = useFeed();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return <Card data={item} />;
    },
    [feed],
  );

  if (isLoading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
    );
  }

  if (feed.length === 0)
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        no data found...
      </Text>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={5}
        windowSize={5}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
});
