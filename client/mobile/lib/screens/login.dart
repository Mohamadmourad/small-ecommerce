import 'package:flutter/material.dart';
import '../components/button.dart';
import '../utils/callApi.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool isLoading = false;
  String errorMessage = '';

  Future<void> handleLogin() async {
    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      setState(() {
        errorMessage = 'Please fill in all fields';
      });
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await callApi('POST', '/auth/login', body: {
        'email': emailController.text,
        'password': passwordController.text,
      });

      if (response['status'] == 200) {
        final token = response['data'].toString();

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth', token);
        Navigator.pushReplacementNamed(context, '/home');

      } else {
        print(response);
          setState(() {
            errorMessage = response['data']?.toString() ?? 'Login failed';
          });
      }
    } catch (error) {
        setState(() {
          errorMessage = 'Error: ${error.toString()}';
        });

    } finally {
        setState(() {
          isLoading = false;
        });
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(
                  Icons.lock_outline,
                  size: 64,
                  color: Color(0xFF212121),
                ),
                const SizedBox(height: 32.0),
                
                const Text(
                  'Welcome Back',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF212121),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8.0),
                
                const Text(
                  'Sign in to your account',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFF8E8E93),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48.0),
                
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFFEBEBEB)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFFEBEBEB)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF212121), width: 2),
                    ),
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16.0),
                
                TextField(
                  controller: passwordController,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFFEBEBEB)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFFEBEBEB)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF212121), width: 2),
                    ),
                    prefixIcon: Icon(Icons.lock_outline),
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 24.0),
                if (errorMessage.isNotEmpty) ...[
                  Text(
                    errorMessage,
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16.0),
                ],
                
                CustomButton(
                  text: 'Login',
                  onPressed: isLoading ? null : handleLogin,
                  variant: ButtonVariant.primary,
                  size: ButtonSize.medium,
                  isLoading: isLoading,
                ),
                const SizedBox(height: 16.0),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/signup');
                  },
                  child: const Text(
                    'Don\'t have an account? Sign Up',
                    style: TextStyle(
                      color: Color(0xFF212121),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}