import React, {useState} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import SubMenu from './SubMenu' // Import the SubMenu component
import {KorolJoystick} from 'korol-joystick'
import {JoystickUpdateEvent} from 'korol-joystick/lib/Joystick'
import TcpSocket from 'react-native-tcp-socket';

const options = {
    port: 42069,
    host: '192.168.0.110',
    // localAddress: '127.0.0.1',
    reuseAddress: true,
    // // localPort: 20000,
    // interface: "wifi",
};

// Create socket
const client = TcpSocket.connect(options, () => {
    // Write on the socket
    client.write('Hello server!');

    // Close socket
    // client.resume();
});

// client.destroy();
client.on('data', (data: ArrayBufferLike | string) => {
    // console.log(typeof data)
    if (typeof data !== 'string') {
        const array = new Uint8Array(data)
        let decodedString = '';
        for (let i = 0; i < array.length; i++) {
            decodedString += String.fromCharCode(array[i]);
        }
        // console.log(decodedString);
        console.log('message was received', decodedString);
    }
});

client.on('error', function (error) {
    console.log(error);
});

client.on('close', function () {
    console.log('Connection closed!');
});

export default function Choice(): React.JSX.Element {
    const [selectedChoice, setSelectedChoice] = useState(null)

    // const socket = new WebSocket('ws://192.168.0.111:5000') // Define the WebSocket here

    // useWebSocket(socket);

    const choices = [
        {
            name: 'jCar',
            child: ['forward', 'backward', 'on', 'off'],
        },
        {
            name: 'JCam',
            child: ['on', 'off'],
        },
    ]
    const handleChoiceSelection = (choiceType: any, key?: string): void => {
        console.log('Choice selected:', choiceType, 'Key:', key);
    
        if (key == 'jCar_on') {
            client.write('on');
            console.log('Sent command: JCar_on');
        } else if (key == 'jCar_off') {
            client.write('off');
            console.log('Sent command: JCar_off');
        } else if (key == 'jCar_forward') {
            client.write("forward");
            console.log('Sent command: JCar_forward');
        } else if (key == 'jCar_backward') {
            client.write("backward");
            console.log('Sent command: JCar_backward');
        } else if (key == 'JCam_on') {
            client.write(key);
            console.log('Sent command: simpCam_on');
        } else if (key == 'JCam_off') {
            client.write(key);
            console.log('Sent command: simpCam_off');
        } else {
            setSelectedChoice(choiceType);
            console.log('Selected choice:', choiceType);
        }
    }
    

    const processData = (joystickData: JoystickUpdateEvent) => {
        // Adjust the angle ranges to match your joystick
        if (joystickData.angle.degree < 45 || joystickData.angle.degree >= 315) {
            console.log("rigt")
            client.write("right");
        } else if (joystickData.angle.degree >= 225 && joystickData.angle.degree < 315) {
            console.log("backward")
            client.write("backward");
        } else if (joystickData.angle.degree >= 135 && joystickData.angle.degree < 225) {
            client.write("left");
            console.log("left")
        } else if (joystickData.angle.degree >= 45 && joystickData.angle.degree < 135) {
            console.log("forward")
            client.write("forward")
        }
    }

    return (
        <View style={styles.container}>
            {selectedChoice ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.choiceButton}
                        onPress={() => setSelectedChoice(null)}>
                        <Text style={styles.buttonLabel}>Back to Main Menu</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                choices.map((choice, index) => (
                    <View style={styles.buttonContainer} key={index}>
                        <TouchableOpacity
                            style={styles.choiceButton}
                            onPress={() => handleChoiceSelection(choice.name)}>
                            <Text style={styles.buttonLabel}>{choice.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}

            <SubMenu
                choices={choices}
                handleChoiceSelection={handleChoiceSelection}
                selectedChoice={selectedChoice}
            // ws={undefined}                // ws={socket}
            />
            {selectedChoice === "jCar" && (
                <View >
                    <KorolJoystick
                        color='#06b6d4'
                        radius={75}
                        onMove={JoystickData => processData(JoystickData)}
                    /></View>
            )}
        </View>
    )
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
