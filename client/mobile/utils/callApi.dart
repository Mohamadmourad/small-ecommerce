import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

enum HttpMethod { GET, POST, PUT, DELETE, PATCH }

Future<Map<String, dynamic>> callApi(
  String method,
  String endpoint, {
  Map<String, dynamic>? body,
}) async {
  const String prefix = "http://192.168.56.1:8080";

  try {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth');

    final headers = <String, String>{
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };

    final uri = Uri.parse('$prefix$endpoint');
    http.Response response;

    switch (method.toUpperCase()) {
      case 'GET':
        response = await http.get(uri, headers: headers);
        break;
      case 'POST':
        response = await http.post(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'PUT':
        response = await http.put(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'DELETE':
        response = await http.delete(uri, headers: headers);
        break;
      case 'PATCH':
        response = await http.patch(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      default:
        throw Exception('Unsupported HTTP method: $method');
    }

    final responseData = response.body.isNotEmpty 
        ? jsonDecode(response.body) 
        : null;

    return {
      'data': responseData,
      'status': response.statusCode,
      'message': 'Success',
    };
  } catch (error) {
    if (error is http.ClientException) {
      return {
        'data': null,
        'status': 0,
        'message': 'Network error - no response from server',
      };
    } else {
      return {
        'data': null,
        'status': 0,
        'message': error.toString(),
      };
    }
  }
}
