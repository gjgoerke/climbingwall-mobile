import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onRegister } = useAuth();

    const register = async () => {
        const result = await onRegister!({
            username: username,
            email: email,
            password: password
        });
        if (result && result.error) {
            alert(result.msg);
        }
    }
return(
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput onChangeText={(text: string) => {setUsername(text);}} value = {username} placeholder='username'/>
                <TextInput onChangeText={(text: string) => {setEmail(text);}} value = {email} placeholder='email'/>
                <TextInput onChangeText={(text: string) => {setPassword(text);}} value = {password} placeholder='password' secureTextEntry={true}/>
            </View>
            <View style={styles.buttons}>
                <Button onPress={register} mode='outlined'>Submit</Button>
                <Button onPress={router.back} mode='outlined'>Go back to login</Button>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inputContainer : {
        width: '100%',
        maxWidth: 400,
        gap: 10,
        marginBottom: 20,
    },
    buttons : {
        width: '100%',
        gap: '10',
    }
});
export default Register;