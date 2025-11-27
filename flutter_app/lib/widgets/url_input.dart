import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/download_service.dart';


class UrlInput extends StatefulWidget {
final void Function(String) onStatus;
const UrlInput({required this.onStatus, super.key});


@override
State<UrlInput> createState() => _UrlInputState();
}


class _UrlInputState extends State<UrlInput> {
final TextEditingController _ctrl = TextEditingController();
bool _loading = false;


void _showStatus(String s) => widget.onStatus(s);


Future<void> _handle() async {
final url = _ctrl.text.trim();
if (url.isEmpty) return _showStatus('Enter a URL');


setState(() => _loading = true);
_showStatus('Detecting platform...');


final platform = ApiService.detectPlatform(url);
if (platform == null) {
_showStatus('Unsupported platform');
setState(() => _loading = false);
return;
}


_showStatus('Requesting download link from backend...');
final downloadUrl = await ApiService.getDownloadUrl(url, platform);
if (downloadUrl == null) {
_showStatus('Failed to get download URL');
setState(() => _loading = false);
return;
}


_showStatus('Starting download...');
final saved = await DownloadService.downloadFile(downloadUrl);
if (saved != null) {
_showStatus('Saved to $saved');
} else {
_showStatus('Download failed');
}


setState(() => _loading = false);
}


@override
Widget build(BuildContext context) {
return Column(
child: _loading ? const CircularProgressIndicator() : const Text('Downloa