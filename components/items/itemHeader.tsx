import { Text, View } from "react-native";
import { COLORS } from "../../constans/Color";

export function ItemHeader({ itemsLength }: any) {
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
    </View>
  );
}
