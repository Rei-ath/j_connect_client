import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// Define a type for the choice object
export type Choice = {
    name: string;
    child: string[];
};

type SubMenuProps = {
    choices: Choice[];
    handleChoiceSelection: (choiceType: string, key: string) => void;
    selectedChoice: string | null;
    // ws:WebSocket
};

export default function SubMenu({
    choices,
    handleChoiceSelection,
    selectedChoice,
}: SubMenuProps): React.JSX.Element {
    const renderSubMenu = (choiceName: string) => {
        const choice = choices.find((c) => c.name === choiceName);
        if (!choice) return null;

        return choice.child.map((child) => {
            const key = `${choice.name}_${child}`;
            const handlePress = () => handleChoiceSelection(child, key);

            return (
                <View key={key} style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.choiceButton} onPress={handlePress}>
                        <Text style={styles.buttonLabel}>{child}</Text>
                    </TouchableOpacity>
                </View>
            );
        });
    };

    return (
        <View>

            {selectedChoice && renderSubMenu(selectedChoice)}

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    choiceButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
})
