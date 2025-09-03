import 'package:flutter/material.dart';
import 'package:mobile/screens/cart.dart';
import 'package:mobile/screens/checkout.dart';
import 'package:mobile/screens/home.dart';
import 'screens/login.dart';
import 'screens/register.dart';
import 'screens/payment_success.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      home: const Login(),
      routes: {
        '/login': (context) => const Login(),
        '/signup': (context) => const Register(),
        '/home': (context) => const Home(),
        '/cart': (context) => const Cart(),
  '/checkout': (context) => const Checkout(),
  '/payment-success': (context) => const PaymentSuccess(),
      },
    );
  }
}

