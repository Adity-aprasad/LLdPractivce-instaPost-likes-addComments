import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
} from "react-native";
import { useFeed } from "../Context/Context";
import React, { useCallback, useMemo, useState } from "react";

const Card = React.memo(({ data }: { data: any }) => {
  const { user, likes, comments, isLiked, id, content } = data;
  const { toggleLikes, addComments } = useFeed(); // Match the name in your Context
  const [isActive, setActive] = useState(false);
  const [typedText, setText] = useState("");

  const handlecomments = useCallback(
    (id) => {
      return setActive((prev) => !prev);
    },
    [isActive],
  );

  const handleAddComments = (id: string) => {
    if (!typedText) return null;
    const newComment = typedText;
    addComments(id, newComment);
    setText("");
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{user}</Text>
      </View>

      <Text style={styles.content}>{content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => toggleLikes(id)}
        >
          <Text style={styles.heartIcon}>{isLiked ? "❤️" : "🤍"}</Text>
          <Text style={styles.likeCount}>{likes} Likes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => handlecomments(id)}
        >
          <Text style={styles.commentText}>comments</Text>
        </TouchableOpacity>
      </View>
      {isActive ? (
        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>Comments ({comments.length})</Text>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={styles.commentTextItem}>• {comment}</Text>
            </View>
          ))}
          <TextInput
            placeholder="...add comments"
            value={typedText}
            onChangeText={setText}
          />
          <Button title="addComments" onPress={() => handleAddComments(id)} />
        </View>
      ) : null}
    </View>
  );
});

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1c",
  },
  content: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    justifyContent: "space-between",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  likeCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  commentButton: {
    paddingVertical: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },

  commentSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f9f9f9",
  },
  commentHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
  commentItem: {
    paddingVertical: 4,
  },
  commentTextItem: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
  },
});
