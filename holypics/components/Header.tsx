import React, { Fragment } from "react";
import { Menu, Pressable, Box, HamburgerIcon } from 'native-base';
export default function Header(){
    return (
        <Box h="10" w="100%" alignItems="flex-start">
            <Menu w="190" trigger={triggerProps => {
            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <HamburgerIcon />
                    </Pressable>;
            }}>
                <Menu.Item>Arial</Menu.Item>
                <Menu.Item>Nunito Sans</Menu.Item>
                <Menu.Item>Roboto</Menu.Item>
                <Menu.Item>Poppins</Menu.Item>
                <Menu.Item>SF Pro</Menu.Item>
                <Menu.Item>Helvetica</Menu.Item>
                <Menu.Item isDisabled>Sofia</Menu.Item>
                <Menu.Item>Cookie</Menu.Item>
            </Menu>
        </Box>
    )
}