import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { onLogin } = useAuth();

    const login = async () => {
        try {
            setLoading(true);
            const result = await onLogin!({
                username: username,
                password: password
            });
            if (result && result.error) {
                alert(result.msg);
            } else {
                console.log('Login successful')
            }
        } catch (error) {
            console.error('Login error: ', error);
            alert('An error occurred during login.')
        } finally {
            setLoading(false);
        }
    }
    const handleRegisterPress = () => {
        router.push('/register');
    };
    return(
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                    onChangeText={(text: string) => {setUsername(text);}} 
                    value = {username} 
                    placeholder='username'
                    autoCapitalize='none'
                    disabled={loading}/>
                <TextInput 
                    onChangeText={(text: string) => {setPassword(text);}} 
                    value = {password} 
                    placeholder='password' 
                    secureTextEntry={true}
                    autoCapitalize='none'
                    disabled={loading}/>
            </View>
            <View style = {styles.buttons}>
                <Button onPress={login} mode='outlined'>Sign in</Button>
                <Button onPress={handleRegisterPress} mode='outlined'>Create an account</Button>
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
export default Login;