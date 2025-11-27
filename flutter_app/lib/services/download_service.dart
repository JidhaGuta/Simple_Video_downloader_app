import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';


class DownloadService {
final Dio _dio = Dio();


Future<String> downloadVideo(String url, String fileName) async {
try {
final dir = await getApplicationDocumentsDirectory();
String savePath = "${dir.path}/$fileName.mp4";


await _dio.download(url, savePath);


return savePath;
} catch (e) {
throw Exception("Download failed: $e");
}
}
}