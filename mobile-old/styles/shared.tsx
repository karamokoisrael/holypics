import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
    boxBordered: {
      borderRadius: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 1,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
    },

    responsiveRow: {
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
      flexWrap: "wrap",
      width:"100%"
    }
});