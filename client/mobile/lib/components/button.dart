import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final Widget? icon;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: getButtonHeight(),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: getBackgroundColor(),
          foregroundColor: getForegroundColor(),
          elevation: 0,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(6), // Slightly rounded, similar to web
            side: getBorderSide(),
          ),
          padding: EdgeInsets.symmetric(
            horizontal: getHorizontalPadding(),
            vertical: getVerticalPadding(),
          ),
          disabledBackgroundColor: getBackgroundColor().withOpacity(0.5),
          disabledForegroundColor: getForegroundColor().withOpacity(0.5),
        ),
        child: isLoading
            ? SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(getForegroundColor()),
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    icon!,
                    const SizedBox(width: 8),
                  ],
                  Text(
                    text,
                    style: TextStyle(
                      fontSize: getFontSize(),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  double getButtonHeight() {
    switch (size) {
      case ButtonSize.small:
        return 32;
      case ButtonSize.medium:
        return 36;
      case ButtonSize.large:
        return 40;
    }
  }

  double getHorizontalPadding() {
    switch (size) {
      case ButtonSize.small:
        return 12;
      case ButtonSize.medium:
        return 16;
      case ButtonSize.large:
        return 24;
    }
  }

  double getVerticalPadding() {
    return 8;
  }

  double getFontSize() {
    switch (size) {
      case ButtonSize.small:
        return 12;
      case ButtonSize.medium:
        return 14;
      case ButtonSize.large:
        return 16;
    }
  }

  Color getBackgroundColor() {
    switch (variant) {
      case ButtonVariant.primary:
        return const Color(0xFF212121); // oklch(0.205 0 0) converted to hex
      case ButtonVariant.secondary:
        return const Color(0xFFF7F7F7); // oklch(0.97 0 0)
      case ButtonVariant.outline:
        return Colors.transparent;
      case ButtonVariant.ghost:
        return Colors.transparent;
    }
  }

  Color getForegroundColor() {
    switch (variant) {
      case ButtonVariant.primary:
        return const Color(0xFFFBFBFB); // oklch(0.985 0 0)
      case ButtonVariant.secondary:
        return const Color(0xFF212121);
      case ButtonVariant.outline:
        return const Color(0xFF212121);
      case ButtonVariant.ghost:
        return const Color(0xFF212121);
    }
  }

  BorderSide getBorderSide() {
    switch (variant) {
      case ButtonVariant.outline:
        return const BorderSide(
          color: Color(0xFFEBEBEB), // oklch(0.922 0 0)
          width: 1,
        );
      default:
        return BorderSide.none;
    }
  }
}

enum ButtonVariant {
  primary,
  secondary,
  outline,
  ghost,
}

enum ButtonSize {
  small,
  medium,
  large,
}
