from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import urlopen, URLError, HTTPError

def parse_url_params(url):
    if url is None:
        return {}
    index = url.find('?')
    if index < 0:
        return {}
    substr = url[index+1:]
    pairs = substr.split('&')
    result = {}
    for pair in pairs:
        key_value = pair.split('=')
        result[key_value[0]] = key_value[1]
    return result

class ProxyRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        params = parse_url_params(self.path)
        target_url = params.get('url')
        if target_url is None:
            self.__error_bad_request()
            return
        print('target_url = {}'.format(target_url))
        api_url = 'https://b.hatena.ne.jp/entry/jsonlite/?url={}'.format(target_url)
        try:
            with urlopen(api_url) as res:
                data = res.read()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(data)
        except URLError as e:
            print('{}'.format(e), file=sys.stderr)
            self.__error_internal_server_error()
        except HTTPError as e:
            print('{}'.format(e), file=sys.stderr)
            self.__error_internal_server_error()

    def __error(self, status, message):
        self.send_response(status)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(message)

    def __error_bad_request(self):
        self.__error(400, b'Bad Request')

    def __error_internal_server_error(self):
        self.__error(500, b'Internal Server Error')


with HTTPServer(('', 8102), ProxyRequestHandler) as server:
    server.serve_forever()
