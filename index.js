import { findByName, findByProps } from "@vendetta/metro";
import {
    stylesheet,
    React,
    ReactNative,
    i18n
} from "@vendetta/metro/common";

import { instead } from "@vendetta/patcher";

let patches = [];

const {
    View,
    Text,
    TouchableOpacity,
    BlurView
} = ReactNative;

const ConnectedWebhooksOverview = findByName(
    "ConnectedWebhooksOverview",
    false
);

const { create: createWebhook } = findByProps(
    "update",
    "create",
    "fetchForChannel"
);

const { getChannel } = findByProps("getChannel");

const Styles = stylesheet.createThemedStyleSheet({
    container: {
        flex: 1,
        paddingBottom: 34
    },

    buttonWrapper: {
        marginHorizontal: 18,
        marginTop: 18,
        borderRadius: 22,
        overflow: "hidden",

        // sombra estilo iOS
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8
        },

        elevation: 10
    },

    button: {
        height: 58,
        borderRadius: 22,

        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",

        // fundo estilo iOS
        backgroundColor: "rgba(255,255,255,0.12)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)"
    },

    icon: {
        fontSize: 20,
        marginRight: 10
    },

    text: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: 0.2
    },

    subText: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 11,
        marginTop: 2,
        fontWeight: "500"
    },

    textContainer: {
        alignItems: "center"
    }
});

function onLoad() {
    patches.push(
        instead("default", ConnectedWebhooksOverview, (args, orig) => {
            const channel = getChannel(args[0]?.channelId);

            return (
                <View style={Styles.container}>
                    {orig?.(...args)}

                    <View style={Styles.buttonWrapper}>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={Styles.button}
                            onPress={() => {
                                createWebhook?.(
                                    channel?.guild_id,
                                    channel?.id
                                );
                            }}
                        >
                            <Text style={Styles.icon}>􀍡</Text>

                            <View style={Styles.textContainer}>
                                <Text style={Styles.text}>
                                    {i18n?.Messages?.WEBHOOK_CREATE ||
                                        "Create Webhook"}
                                </Text>

                                <Text style={Styles.subText}>
                                    Fast Discord Integration
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        })
    );
}

export default {
    onLoad,

    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        }
    }
};
