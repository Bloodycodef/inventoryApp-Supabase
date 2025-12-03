import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constans/Color";

export function ItemHeader({
  itemsLength,
  isAdmin,
  isFormVisible,
  setIsFormVisible,
}: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderColor: COLORS.separator,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        📄 Daftar Item ({itemsLength})
      </Text>

      {isAdmin && (
        <TouchableOpacity onPress={() => setIsFormVisible(!isFormVisible)}>
          <MaterialCommunityIcons
            name={
              isFormVisible ? "close-circle-outline" : "plus-circle-outline"
            }
            size={26}
            color={isFormVisible ? COLORS.danger : COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
