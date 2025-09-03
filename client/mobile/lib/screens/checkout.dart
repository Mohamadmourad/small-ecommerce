import 'package:flutter/material.dart';
import '../utils/callApi.dart';
import '../components/button.dart';

class Checkout extends StatefulWidget {
  const Checkout({super.key});

  @override
  State<Checkout> createState() => _CheckoutState();
}

class _CheckoutState extends State<Checkout> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController fullNameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  bool isLoading = false;

  @override
  void dispose() {
    fullNameController.dispose();
    phoneController.dispose();
    addressController.dispose();
    super.dispose();
  }

  Future<void> _handlePay() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isLoading = true);
    try {
      final resp = await callApi('POST', '/orders/create', body: {
        'shippingAddress': addressController.text.trim(),
        'phoneNumber': phoneController.text.trim(),
        'fullName': fullNameController.text.trim(),
      });

      if (resp['status'] == 200 || resp['status'] == 201) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order placed successfully')));
        // Go back to the root/home screen
        Navigator.of(context).popUntil((route) => route.isFirst);
      } else {
        final msg = resp['data'] ?? resp['message'] ?? 'Failed to place order';
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $msg')));
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Network error: ${e.toString()}')));
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout'), backgroundColor: const Color(0xFF212121)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: fullNameController,
                decoration: const InputDecoration(labelText: 'Full name'),
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your full name' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Phone number'),
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter phone number' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: addressController,
                decoration: const InputDecoration(labelText: 'Shipping address'),
                maxLines: 3,
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter shipping address' : null,
              ),
              const Spacer(),
              SizedBox(
                height: 48,
                width: double.infinity,
                child: CustomButton(
                  text: 'Pay',
                  isLoading: isLoading,
                  onPressed: isLoading ? null : _handlePay,
                  variant: ButtonVariant.primary,
                  size: ButtonSize.large,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}