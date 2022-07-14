
import { useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import i18n from 'i18n-js';
type HeaderProps = {
  openDrawer: any
};

export default function Header(props: HeaderProps) {
  const { openDrawer } = props;
  const navigation = useNavigation();
  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" color="white" onPress={openDrawer} />
      <Appbar.Content title={i18n.t("welcome")} />
    </Appbar.Header>
  );
}
