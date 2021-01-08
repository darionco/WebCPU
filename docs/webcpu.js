var webcpu = (function (exports) {
    'use strict';

    var WorkerClass = null;

    try {
        var WorkerThreads =
            typeof module !== 'undefined' && typeof module.require === 'function' && module.require('worker_threads') ||
            typeof __non_webpack_require__ === 'function' && __non_webpack_require__('worker_threads') ||
            typeof require === 'function' && require('worker_threads');
        WorkerClass = WorkerThreads.Worker;
    } catch(e) {} // eslint-disable-line

    function decodeBase64(base64, enableUnicode) {
        return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
    }

    function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        return function WorkerFactory(options) {
            return new WorkerClass(body, Object.assign({}, options, { eval: true }));
        };
    }

    function decodeBase64$1(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
            var binaryView = new Uint8Array(binaryString.length);
            for (var i = 0, n = binaryString.length; i < n; ++i) {
                binaryView[i] = binaryString.charCodeAt(i);
            }
            return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
    }

    function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64$1(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        var blob = new Blob([body], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory(options) {
            url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
            return new Worker(url, options);
        };
    }

    var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

    function isNodeJS() {
        return kIsNodeJS;
    }

    function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
        if (isNodeJS()) {
            return createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg);
        }
        return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
    }

    var WorkerFactory = createBase64WorkerFactory$2('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIGNvbnN0IGtJc05vZGVKUyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzIDogMCkgPT09ICdbb2JqZWN0IHByb2Nlc3NdJzsKICAgIGNvbnN0IGtSZXF1aXJlID0ga0lzTm9kZUpTID8gbW9kdWxlLnJlcXVpcmUgOiBudWxsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lCgogICAgY29uc3QgX3NlbGYgPSBrSXNOb2RlSlMgPyBrUmVxdWlyZSgnd29ya2VyX3RocmVhZHMnKS5wYXJlbnRQb3J0IDogc2VsZjsgLy8gZXNsaW50LWRpc2FibGUtbGluZQogICAgY29uc3QgX3BlcmZvcm1hbmNlID0ga0lzTm9kZUpTID8ga1JlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZSA6IHBlcmZvcm1hbmNlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lCgogICAgbGV0IHdhc20gPSBudWxsOwogICAgbGV0IG1lbW9yeSA9IG51bGw7CiAgICBsZXQgdmlldyA9IG51bGw7CgogICAgbGV0IHJ1bldvcmtsb2FkID0gKCkgPT4gewogICAgICAgIHRocm93ICdFUlJPUjogV29ya2VyIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCEnOwogICAgfTsKCiAgICAvKioKICAgICAqIEZ1bmN0aW9uIHRvIHJ1biB0aGUgbnVtZXJpYyB3b3JrbG9hZCBpbiB0aGUgY3VycmVudCB0aHJlYWQgZm9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUgaW4gSmF2YVNjcmlwdC4KICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiAtIFRoZSBkdXJhdGlvbiBvZiB0aGlzIHdvcmtsb2FkIGluIG1pbGxpc2Vjb25kcwogICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoaXMgdGhyZWFkLgogICAgICogQHJldHVybnMge3tlbGFwc2VkOiBudW1iZXIsIHJlc3VsdDogbnVtYmVyLCBpZDogKiwgaXRlcmF0aW9uczogbnVtYmVyfX0KICAgICAqIEBwcml2YXRlCiAgICAgKi8KICAgIGZ1bmN0aW9uIHJ1bldvcmtsb2FkSlMoZHVyYXRpb24sIGlkKSB7CiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW47CiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3M7CiAgICAgICAgY29uc3QgTV9QSSA9IE1hdGguUEk7CgogICAgICAgIGxldCBjcmVhbCA9IC0wLjg7CiAgICAgICAgbGV0IGNpbWFnID0gMC4xNTY7CgogICAgICAgIGxldCBmcmFtZSA9IDA7CgogICAgICAgIGxldCB5OwogICAgICAgIGxldCB4OwogICAgICAgIGxldCBpOwogICAgICAgIGxldCBpaTsKCiAgICAgICAgbGV0IGN4OwogICAgICAgIGxldCBjeTsKICAgICAgICBsZXQgeHQ7CgogICAgICAgIGNvbnN0IHN0YXJ0ID0gX3BlcmZvcm1hbmNlLm5vdygpOwogICAgICAgIGxldCBlbmQgPSBzdGFydDsKCiAgICAgICAgZm9yIChpaSA9IDA7IGVuZCAtIHN0YXJ0IDwgZHVyYXRpb247ICsraWksIGVuZCA9IF9wZXJmb3JtYW5jZS5ub3coKSkgewogICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgMjAwOyArK3kpIHsKICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCAyMDA7ICsreCkgewogICAgICAgICAgICAgICAgICAgIGN4ID0gLTIgKyB4IC8gNTA7CiAgICAgICAgICAgICAgICAgICAgY3kgPSAtMiArIHkgLyA1MDsKICAgICAgICAgICAgICAgICAgICBpID0gMDsKCiAgICAgICAgICAgICAgICAgICAgZG8gewogICAgICAgICAgICAgICAgICAgICAgICB4dCA9IGN4ICogY3ggLSBjeSAqIGN5ICsgY3JlYWw7CiAgICAgICAgICAgICAgICAgICAgICAgIGN5ID0gMiAqIGN4ICogY3kgKyBjaW1hZzsKICAgICAgICAgICAgICAgICAgICAgICAgY3ggPSB4dDsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChjeCAqIGN4ICsgY3kgKiBjeSA8IDQpICYmICsraSA8IDI1KTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgICArK2ZyYW1lOyAvLyBpbmNyZWFzZSB0aGUgbnVtYmVyIG9mIHRoZSBmcmFtZQogICAgICAgICAgICBjcmVhbCA9IC0wLjggKyAwLjYgKiBzaW4oZnJhbWUgLyAoTV9QSSAqIDIwKSk7IC8vIGNhbGN1bGF0ZSB0aGUgbmV3IGNvb3JkaW5hdGVzCiAgICAgICAgICAgIGNpbWFnID0gMC4xNTYgKyAwLjQgKiBjb3MoZnJhbWUgLyAoTV9QSSAqIDQwKSk7IC8vIG9mIHRoZSBjIHBvaW50CiAgICAgICAgfQoKICAgICAgICByZXR1cm4gewogICAgICAgICAgICBlbGFwc2VkOiBlbmQgLSBzdGFydCwKICAgICAgICAgICAgaXRlcmF0aW9uczogZnJhbWUsCiAgICAgICAgICAgIHJlc3VsdDogeHQsCiAgICAgICAgICAgIGlkLAogICAgICAgIH07CiAgICB9CgogICAgLyoqCiAgICAgKiBGdW5jdGlvbiB0byBydW4gdGhlIG51bWVyaWMgd29ya2xvYWQgaW4gdGhlIGN1cnJlbnQgdGhyZWFkIGZvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiB0aW1lIGluIFdBU00uCiAgICAgKiBOb3RlOiB0aGUgV0FTTSBtb2R1bGUgbXVzdCBiZSBwcmUtbG9hZGVkIGJ5IHNlbmRpbmcgdGhlIGBpbml0YCBtZXNzYWdlIGZyb20gdGhlIG1haW4gdGhyZWFkLgogICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHRoaXMgd29ya2xvYWQgaW4gbWlsbGlzZWNvbmRzCiAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhpcyB0aHJlYWQuCiAgICAgKiBAcmV0dXJucyB7e2VsYXBzZWQ6IG51bWJlciwgcmVzdWx0OiBudW1iZXIsIGlkOiAqLCBpdGVyYXRpb25zOiBudW1iZXJ9fQogICAgICogQHByaXZhdGUKICAgICAqLwogICAgZnVuY3Rpb24gcnVuV29ya2xvYWRXQVNNKGR1cmF0aW9uLCBpZCkgewogICAgICAgIHdhc20uZXhwb3J0cy5fcnVuV29ya2xvYWQoZHVyYXRpb24sIDQpOwogICAgICAgIHJldHVybiB7CiAgICAgICAgICAgIGl0ZXJhdGlvbnM6IHZpZXcuZ2V0VWludDMyKDQsIHRydWUpLAogICAgICAgICAgICByZXN1bHQ6IHZpZXcuZ2V0VWludDMyKDgsIHRydWUpLAogICAgICAgICAgICBlbGFwc2VkOiB2aWV3LmdldEZsb2F0MzIoMTIsIHRydWUpLAogICAgICAgICAgICBpZCwKICAgICAgICB9OwogICAgfQoKICAgIC8qKgogICAgICogSGFuZGxlcyBldmVudHMgc2VudCB0byB0aGlzIHRocmVhZCwgZnJvbSBvdGhlciB0aHJlYWRzLCB0aHJvdWdoIHRoZSBgc2VsZmAgb2JqZWN0LgogICAgICogVGhlIG1lc3NhZ2VzIGNhbmUgYmU6CiAgICAgKiBgaW5pdGAgLSB0byBpbml0aWFsaXplIHRoaXMgdGhyZWFkLCB0YWtlcyBjYXJlIG9mIGJyaWVmbHkgcnVubmluZyB0byB3b3JrbG9hZCB0byBhbGxvdyBDUFVzIHRvIGNhY2hlIHRoZSBjb2RlCiAgICAgKiBgd29ya2xvYWRgIC0gcnVucyB0aGUgd29ya2xvYWQgb24gdGhpcyB0aHJlYWQgZm9yIDEwbXMgYW5kIHJldHVybnMgdGhlIHJlc3VsdHMgdG8gdGhlIGNhbGxpbmcgdGhyZWFkCiAgICAgKiBAcGFyYW0ge01lc3NhZ2VFdmVudH0gZSAtIFRoZSBwb3N0ZWQgbWVzc2FnZSBldmVudC4KICAgICAqIEBwcml2YXRlCiAgICAgKi8KICAgIChfc2VsZi5vbiB8fCBfc2VsZi5hZGRFdmVudExpc3RlbmVyKS5jYWxsKF9zZWxmLCAnbWVzc2FnZScsIGUgPT4gewogICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlLmRhdGEgfHwgZTsKCiAgICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHsKICAgICAgICAgICAgY2FzZSAnaW5pdCc6CiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53YXNtKSB7CiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVtb3J5U2l6ZSA9IDE2OwogICAgICAgICAgICAgICAgICAgIG1lbW9yeSA9IG5ldyBXZWJBc3NlbWJseS5NZW1vcnkoe2luaXRpYWw6IG1lbW9yeVNpemUsIG1heGltdW06IG1lbW9yeVNpemV9KTsKICAgICAgICAgICAgICAgICAgICB2aWV3ID0gbmV3IERhdGFWaWV3KG1lbW9yeS5idWZmZXIpOwogICAgICAgICAgICAgICAgICAgIHdhc20gPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2UobWVzc2FnZS53YXNtLCB7CiAgICAgICAgICAgICAgICAgICAgICAgIGVudjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgX25vdzogX3BlcmZvcm1hbmNlLm5vdy5iaW5kKF9wZXJmb3JtYW5jZSksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnk6IG1lbW9yeSwKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgICAgICBydW5Xb3JrbG9hZCA9IHJ1bldvcmtsb2FkV0FTTTsKICAgICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgcnVuV29ya2xvYWQgPSBydW5Xb3JrbG9hZEpTOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgcnVuV29ya2xvYWQoMSwgMCk7CiAgICAgICAgICAgICAgICBfc2VsZi5wb3N0TWVzc2FnZSgnc3VjY2VzcycpOwogICAgICAgICAgICAgICAgYnJlYWs7CgogICAgICAgICAgICBjYXNlICd3b3JrbG9hZCc6IHsKICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gewogICAgICAgICAgICAgICAgICAgIF9zZWxmLnBvc3RNZXNzYWdlKHJ1bldvcmtsb2FkKDI1LCBtZXNzYWdlLmlkKSk7CiAgICAgICAgICAgICAgICB9LCBtZXNzYWdlLnN0YXJ0VGltZSAtIERhdGUubm93KCkpOwogICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9KTsKCn0oKSk7Cgo=', 'data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViQ1BVLndvcmtlci5qcyIsInNvdXJjZXMiOlsid29ya2VyOi8vd2ViLXdvcmtlci9XZWJDUFUud29ya2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGtJc05vZGVKUyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzIDogMCkgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcbmNvbnN0IGtSZXF1aXJlID0ga0lzTm9kZUpTID8gbW9kdWxlLnJlcXVpcmUgOiBudWxsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbmNvbnN0IF9zZWxmID0ga0lzTm9kZUpTID8ga1JlcXVpcmUoJ3dvcmtlcl90aHJlYWRzJykucGFyZW50UG9ydCA6IHNlbGY7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbmNvbnN0IF9wZXJmb3JtYW5jZSA9IGtJc05vZGVKUyA/IGtSZXF1aXJlKCdwZXJmX2hvb2tzJykucGVyZm9ybWFuY2UgOiBwZXJmb3JtYW5jZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG5sZXQgd2FzbSA9IG51bGw7XG5sZXQgbWVtb3J5ID0gbnVsbDtcbmxldCB2aWV3ID0gbnVsbDtcblxubGV0IHJ1bldvcmtsb2FkID0gKCkgPT4ge1xuICAgIHRocm93ICdFUlJPUjogV29ya2VyIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCEnO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBydW4gdGhlIG51bWVyaWMgd29ya2xvYWQgaW4gdGhlIGN1cnJlbnQgdGhyZWFkIGZvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiB0aW1lIGluIEphdmFTY3JpcHQuXG4gKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2YgdGhpcyB3b3JrbG9hZCBpbiBtaWxsaXNlY29uZHNcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGlzIHRocmVhZC5cbiAqIEByZXR1cm5zIHt7ZWxhcHNlZDogbnVtYmVyLCByZXN1bHQ6IG51bWJlciwgaWQ6ICosIGl0ZXJhdGlvbnM6IG51bWJlcn19XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBydW5Xb3JrbG9hZEpTKGR1cmF0aW9uLCBpZCkge1xuICAgIGNvbnN0IHNpbiA9IE1hdGguc2luO1xuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zO1xuICAgIGNvbnN0IE1fUEkgPSBNYXRoLlBJO1xuXG4gICAgbGV0IGNyZWFsID0gLTAuODtcbiAgICBsZXQgY2ltYWcgPSAwLjE1NjtcblxuICAgIGxldCBmcmFtZSA9IDA7XG5cbiAgICBsZXQgeTtcbiAgICBsZXQgeDtcbiAgICBsZXQgaTtcbiAgICBsZXQgaWk7XG5cbiAgICBsZXQgY3g7XG4gICAgbGV0IGN5O1xuICAgIGxldCB4dDtcblxuICAgIGNvbnN0IHN0YXJ0ID0gX3BlcmZvcm1hbmNlLm5vdygpO1xuICAgIGxldCBlbmQgPSBzdGFydDtcblxuICAgIGZvciAoaWkgPSAwOyBlbmQgLSBzdGFydCA8IGR1cmF0aW9uOyArK2lpLCBlbmQgPSBfcGVyZm9ybWFuY2Uubm93KCkpIHtcbiAgICAgICAgZm9yICh5ID0gMDsgeSA8IDIwMDsgKyt5KSB7XG4gICAgICAgICAgICBmb3IgKHggPSAwOyB4IDwgMjAwOyArK3gpIHtcbiAgICAgICAgICAgICAgICBjeCA9IC0yICsgeCAvIDUwO1xuICAgICAgICAgICAgICAgIGN5ID0gLTIgKyB5IC8gNTA7XG4gICAgICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIHh0ID0gY3ggKiBjeCAtIGN5ICogY3kgKyBjcmVhbDtcbiAgICAgICAgICAgICAgICAgICAgY3kgPSAyICogY3ggKiBjeSArIGNpbWFnO1xuICAgICAgICAgICAgICAgICAgICBjeCA9IHh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aGlsZSAoKGN4ICogY3ggKyBjeSAqIGN5IDwgNCkgJiYgKytpIDwgMjUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICsrZnJhbWU7IC8vIGluY3JlYXNlIHRoZSBudW1iZXIgb2YgdGhlIGZyYW1lXG4gICAgICAgIGNyZWFsID0gLTAuOCArIDAuNiAqIHNpbihmcmFtZSAvIChNX1BJICogMjApKTsgLy8gY2FsY3VsYXRlIHRoZSBuZXcgY29vcmRpbmF0ZXNcbiAgICAgICAgY2ltYWcgPSAwLjE1NiArIDAuNCAqIGNvcyhmcmFtZSAvIChNX1BJICogNDApKTsgLy8gb2YgdGhlIGMgcG9pbnRcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBlbGFwc2VkOiBlbmQgLSBzdGFydCxcbiAgICAgICAgaXRlcmF0aW9uczogZnJhbWUsXG4gICAgICAgIHJlc3VsdDogeHQsXG4gICAgICAgIGlkLFxuICAgIH07XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gcnVuIHRoZSBudW1lcmljIHdvcmtsb2FkIGluIHRoZSBjdXJyZW50IHRocmVhZCBmb3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgdGltZSBpbiBXQVNNLlxuICogTm90ZTogdGhlIFdBU00gbW9kdWxlIG11c3QgYmUgcHJlLWxvYWRlZCBieSBzZW5kaW5nIHRoZSBgaW5pdGAgbWVzc2FnZSBmcm9tIHRoZSBtYWluIHRocmVhZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiAtIFRoZSBkdXJhdGlvbiBvZiB0aGlzIHdvcmtsb2FkIGluIG1pbGxpc2Vjb25kc1xuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoaXMgdGhyZWFkLlxuICogQHJldHVybnMge3tlbGFwc2VkOiBudW1iZXIsIHJlc3VsdDogbnVtYmVyLCBpZDogKiwgaXRlcmF0aW9uczogbnVtYmVyfX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJ1bldvcmtsb2FkV0FTTShkdXJhdGlvbiwgaWQpIHtcbiAgICB3YXNtLmV4cG9ydHMuX3J1bldvcmtsb2FkKGR1cmF0aW9uLCA0KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpdGVyYXRpb25zOiB2aWV3LmdldFVpbnQzMig0LCB0cnVlKSxcbiAgICAgICAgcmVzdWx0OiB2aWV3LmdldFVpbnQzMig4LCB0cnVlKSxcbiAgICAgICAgZWxhcHNlZDogdmlldy5nZXRGbG9hdDMyKDEyLCB0cnVlKSxcbiAgICAgICAgaWQsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIGV2ZW50cyBzZW50IHRvIHRoaXMgdGhyZWFkLCBmcm9tIG90aGVyIHRocmVhZHMsIHRocm91Z2ggdGhlIGBzZWxmYCBvYmplY3QuXG4gKiBUaGUgbWVzc2FnZXMgY2FuZSBiZTpcbiAqIGBpbml0YCAtIHRvIGluaXRpYWxpemUgdGhpcyB0aHJlYWQsIHRha2VzIGNhcmUgb2YgYnJpZWZseSBydW5uaW5nIHRvIHdvcmtsb2FkIHRvIGFsbG93IENQVXMgdG8gY2FjaGUgdGhlIGNvZGVcbiAqIGB3b3JrbG9hZGAgLSBydW5zIHRoZSB3b3JrbG9hZCBvbiB0aGlzIHRocmVhZCBmb3IgMTBtcyBhbmQgcmV0dXJucyB0aGUgcmVzdWx0cyB0byB0aGUgY2FsbGluZyB0aHJlYWRcbiAqIEBwYXJhbSB7TWVzc2FnZUV2ZW50fSBlIC0gVGhlIHBvc3RlZCBtZXNzYWdlIGV2ZW50LlxuICogQHByaXZhdGVcbiAqL1xuKF9zZWxmLm9uIHx8IF9zZWxmLmFkZEV2ZW50TGlzdGVuZXIpLmNhbGwoX3NlbGYsICdtZXNzYWdlJywgZSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGUuZGF0YSB8fCBlO1xuXG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnaW5pdCc6XG4gICAgICAgICAgICBpZiAobWVzc2FnZS53YXNtKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVtb3J5U2l6ZSA9IDE2O1xuICAgICAgICAgICAgICAgIG1lbW9yeSA9IG5ldyBXZWJBc3NlbWJseS5NZW1vcnkoe2luaXRpYWw6IG1lbW9yeVNpemUsIG1heGltdW06IG1lbW9yeVNpemV9KTtcbiAgICAgICAgICAgICAgICB2aWV3ID0gbmV3IERhdGFWaWV3KG1lbW9yeS5idWZmZXIpO1xuICAgICAgICAgICAgICAgIHdhc20gPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2UobWVzc2FnZS53YXNtLCB7XG4gICAgICAgICAgICAgICAgICAgIGVudjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgX25vdzogX3BlcmZvcm1hbmNlLm5vdy5iaW5kKF9wZXJmb3JtYW5jZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnk6IG1lbW9yeSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBydW5Xb3JrbG9hZCA9IHJ1bldvcmtsb2FkV0FTTTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcnVuV29ya2xvYWQgPSBydW5Xb3JrbG9hZEpTO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVuV29ya2xvYWQoMSwgMCk7XG4gICAgICAgICAgICBfc2VsZi5wb3N0TWVzc2FnZSgnc3VjY2VzcycpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnd29ya2xvYWQnOiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBfc2VsZi5wb3N0TWVzc2FnZShydW5Xb3JrbG9hZCgyNSwgbWVzc2FnZS5pZCkpO1xuICAgICAgICAgICAgfSwgbWVzc2FnZS5zdGFydFRpbWUgLSBEYXRlLm5vdygpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLE9BQU8s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', false);
    /* eslint-enable */

    var workloadWASM = "data:application/wasm;base64,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";

    const kIsNodeJS$1 = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
    const kRequire = kIsNodeJS$1 ? module.require : null; // eslint-disable-line

    /**
     * Utility to estimate the number of usable cores to perform data processing in node.js and the browser.
     *
     * In node.js, it uses the code from [this gist](https://gist.github.com/brandon93s/a46fb07b0dd589dc34e987c33d775679) to
     * query the number of CPUs on the system. It can be configured to run the same estimation as in the browser.
     *
     * In the browser, takes ~2 seconds to estimate the number of CPUs, uses WASM (when available) to perform the estimation.
     *
     * Returns a {@link Promise} that resolves to a {@link WebCPUResult}.
     *
     * ### Installation
     * ```
     * yarn add webcpu
     * ```
     * or
     * ```
     * npm install webcpu
     * ```
     *
     * ### Usage
     * In Web:
     * ```
     * import {WebCPU} from 'webcpu';
     *
     * WebCPU.detectCPU().then(result => {
     *     console.log(`Reported Cores: ${result.reportedCores}`);
     *     console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
     *     console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
     * });
     * ```
     *
     * In Node:
     * ```
     * const WebCPU = require('webcpu/dist/umd/webcpu').WebCPU;
     *
     * WebCPU.detectCPU().then(result => {
     *     console.log(`Reported Cores: ${result.reportedCores}`);
     *     console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
     *     console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
     * });
     * ```
     *
     * ### Description
     * The core estimation is affected by other tasks in the system, usually the OS scheduler is efficient enough that
     * light tasks (playing music, idle programs, background updates, etc) are evenly distributed across cores and so they
     * will not affect the result of this estimation. Heavy tasks do have an effect in the results of the estimation, it is
     * recommended that you avoid performing heavy tasks while the estimation is running, it is considered good practice to
     * run the estimation periodically to compensate for user's CPU workloads and always keep an optimal number of
     * operational cores.
     *
     * The estimation is performed by running a mathematical operation in a loop for a predefined amount of time. Modern
     * CPUs run this task simultaneously across physical cores and usually each core completes a very similar number of
     * operations, once hyper threading (or task scheduling) kicks in, a few cores must share their cycles among
     * threads running. By detecting the changes in operations completed by each thread, it is possible to estimate the
     * number of cores in the system.
     *
     * The current algorithm returns bad estimations for CPUs with asymmetric cores (usually mobile ARM chips) because, as
     * explained above, it detects the changes in number of operations between threads. Asymmetric cores will complete
     * a different number of operations depending on the power of the core the task is scheduled on. Although the returned
     * estimations will be incorrect, they are safe to use to spawn threads.
     *
     * This utility DOES NOT estimate logical cores, instead it uses `navigator.hardwareConcurrency` (if available) or simply
     * returns the same number as the estimated physical cores.
     *
     * ## Methods
     */
    class WebCPU {
        /**
         * Estimates the number of CPUs in this machine.
         * @param {boolean=} hardcore - Engages hardcore mode, which kills all the workers after every test.
         * @param {boolean=} estimateInNode - If `true`, forces core estimation in Node.js rather than querying the system.
         * @returns {Promise<WebCPUResult>} - Result of the estimation.
         */
        static async detectCPU(hardcore = false, estimateInNode = false) {
            let reportedCores;

            if (kIsNodeJS$1) {
                /* we are running in node, emulate the response */
                /* eslint-disable */
                const os = kRequire('os');
                const childProcess = kRequire('child_process');

                reportedCores = kRequire('os').cpus().length;

                if (!estimateInNode) {
                    /* code taken from https://gist.github.com/brandon93s/a46fb07b0dd589dc34e987c33d775679 */
                    const exec = function exec(command) {
                        return childProcess.execSync(command, {encoding: 'utf8'});
                    };

                    const platform = os.platform();
                    let amount = 0;

                    if (platform === 'linux') {
                        const output = exec('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l');
                        amount = parseInt(output.trim(), 10);
                    } else if (platform === 'darwin') {
                        const output = exec('sysctl -n hw.physicalcpu_max');
                        amount = parseInt(output.trim(), 10);
                    } else if (platform === 'windows') {
                        const output = exec('WMIC CPU Get NumberOfCores');
                        amount = output.split(os.EOL)
                            .map(function parse(line) {
                                return parseInt(line)
                            })
                            .filter(function numbers(value) {
                                return !isNaN(value)
                            })
                            .reduce(function add(sum, number) {
                                return sum + number
                            }, 0);
                    }

                    if (amount) {
                        return {
                            reportedCores: reportedCores,
                            estimatedIdleCores: amount,
                            estimatedPhysicalCores: amount,
                        }
                    }
                }
                /* eslint-enable */
            } else {
                reportedCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : null;
            }

            const maxCoresToTest = reportedCores ? reportedCores : Number.MAX_SAFE_INTEGER;
            const workers = [];
            const loops = 2;
            let baseStats;

            let wasmModule = null;
            if (WebAssembly) {
                if (WebAssembly.compileStreaming) {
                    wasmModule = await WebAssembly.compileStreaming(fetch(workloadWASM));
                } else if (WebAssembly.compile) {
                    if (kIsNodeJS$1) {
                        const buffer = Buffer.from(workloadWASM.substr(workloadWASM.indexOf(',') + 1), 'base64');
                        wasmModule = await WebAssembly.compile(buffer);
                    } else {
                        const result = await fetch(workloadWASM);
                        const buffer = await result.arrayBuffer();
                        wasmModule = await WebAssembly.compile(buffer);
                    }
                }
            }

            workers.push(await this._initWorker(wasmModule));
            await this._testWorkers(workers, loops);
            baseStats = await this._testWorkers(workers, loops);
            // console.log(baseStats);

            if (hardcore) {
                this._killWorkers(workers);
            }

            let oddCores = 0;
            let thresholdCount = 0;
            let threadCount = 0;
            while (threadCount < maxCoresToTest) {
                ++threadCount;
                const promises = [];
                for (let i = workers.length; i < threadCount; ++i) {
                    promises.push(this._initWorker(wasmModule).then(worker => workers.push(worker)));
                }
                await Promise.all(promises);
                promises.length = 0;

                const stats = await this._testWorkers(workers, loops);
                if (!this._areAllCoresValid(baseStats, stats, 0.9)) {
                    --threadCount;
                    ++thresholdCount;
                    if (thresholdCount > 3) {
                        if (threadCount % 2 && ++oddCores < 2) {
                            --threadCount;
                            thresholdCount = 0;
                            this._killWorkers([workers.pop()]);
                        } else {
                            this._killWorkers(workers);
                            break;
                        }
                    }
                } else if (thresholdCount) {
                    --threadCount;
                    --thresholdCount;
                }

                if (hardcore) {
                    this._killWorkers(workers);
                }
            }

            let physicalCores;
            if (reportedCores && threadCount < reportedCores) {
                physicalCores = Math.floor(reportedCores / 2);
            } else {
                physicalCores = threadCount;
            }

            return {
                reportedCores: reportedCores,
                estimatedIdleCores: threadCount,
                estimatedPhysicalCores: physicalCores,
            };
        }

        /**
         * Kills all the workers in the specified array.
         * @param {Worker[]} workers - Workers to kill
         * @private
         */
        static _killWorkers(workers) {
            while (workers.length) {
                workers.pop().terminate();
            }
        }

        /**
         * Run tests in the specified workers and repeats the test for the specified number of loops. This function performs
         * and ignores the results of 5 extra loops. This is to mitigate the fact that some processor and OS combinations
         * use lazy loading.
         * @param {Worker[]} workers - The workers in which the test will run.
         * @param {number} loops - The number of times the tests will be repeated.
         * @returns {Promise<Array>}
         * @private
         */
        static async _testWorkers(workers, loops) {
            const stats = [];
            const promises = [];
            const extraLoops = 2;
            const startTime = Date.now() + workers.length * 3;
            let results;
            for (let n = 0; n < loops + extraLoops; ++n) {
                for (let i = 0; i < workers.length; ++i) {
                    promises.push(this._computeWorker(workers[i], i, startTime));
                }
                results = await Promise.all(promises);
                if (n >= extraLoops) {
                    this._addResults(stats, results);
                }
                promises.length = 0;
            }

            this._aggregateResults(stats, loops);

            return stats;
        }

        /**
         * Adds the results from a test loop to the specified stats array.
         * @param {Array} stats - Stats array to save the results in
         * @param {Array} results - The results of a test loop.
         * @private
         */
        static _addResults(stats, results) {
            for (let i = 0; i < results.length; ++i) {
                if (!stats[results[i].id]) {
                    stats[results[i].id] = {
                        elapsed: 0,
                        iterations: 0,
                    };
                }
                stats[results[i].id].elapsed += results[i].elapsed;
                stats[results[i].id].iterations += results[i].iterations;
            }
        }

        /**
         * Aggregates all the results added to a stats object.
         * This function effectively normalizes the data passed to it.
         * @param {Array} stats - Stats array no aggregate.
         * @param {number} loops - The number of times the test ran.
         * @returns {Array}
         * @private
         */
        static _aggregateResults(stats, loops) {
            for (let i = 0; i < stats.length; ++i) {
                stats[i].elapsed /= loops;
                stats[i].iterations /= loops;
            }

            return stats;
        }

        /**
         * Starts the computation task in the specified worker with the specified id.
         * This method also accepts a start time (in ms, usually Date.now() + ms_to delay), useful to synchronize the start
         * time of the computation in multiple threads.
         * @param {Worker} worker - The worker in which the computation will be started.
         * @param {number} id - The id of this thread.
         * @param {number} startTime - A time in the future when the computations should start.
         * @returns {Promise<any>}
         * @private
         */
        static _computeWorker(worker, id, startTime) {
            const addListener = worker.addEventListener || worker.on;
            const removeListener = worker.removeEventListener || worker.off;
            return new Promise(resolve => {
                const handler = e => {
                    removeListener.call(worker, 'message', handler);
                    resolve(e.data || e);
                };
                addListener.call(worker, 'message', handler);
                worker.postMessage({type: 'workload', id, startTime});
            });
        }

        /**
         * Allocates and initializes a worker.
         * @param {WebAssembly.Module=} wasm - The WASM module, if available, that contains the workload.
         * @returns {Promise<any>}
         * @private
         */
        static _initWorker(wasm = null) {
            return new Promise((resolve, reject) => {
                const worker = new WorkerFactory();

                const addListener = worker.addEventListener || worker.on;
                const removeListener = worker.removeEventListener || worker.off;

                const handler = e => {
                    removeListener.call(worker, 'message', handler);
                    const message = e.data || e;
                    if (message === 'success') {
                        resolve(worker);
                    } else {
                        worker.terminate();
                        reject();
                    }
                };
                addListener.call(worker, 'message', handler);
                worker.postMessage({type: 'init', wasm});
            });
        }

        /**
         * Estimates if all the cores, based on the results in the provided `stats` object, are running at the same time and
         * performing the same number of operations.
         * @param {Array} baseStats - The stats resulting from running tests loops on a single core.
         * @param {Array} stats - The stats of multiple cores to test against.
         * @param {number} threshold - Threshold, between 0 ans 1, that defines when a core is not considered physical.
         * @returns {boolean}
         * @private
         */
        static _areAllCoresValid(baseStats, stats, threshold) {
            let iterations = 0;
            stats.sort((a, b) => b.iterations - a.iterations);
            for (let i = 0; i < stats.length; ++i) {
                iterations += stats[i].iterations;
            }

            // console.log(stats);

            const local = stats[stats.length - 1].iterations / stats[0].iterations;
            const global = iterations / (baseStats[0].iterations * stats.length);
            const combined = local * 0.85 + global * 0.15;
            // console.log(`threads:${stats.length} local:${local} global:${global} estimated:${combined}\n`);

            return combined >= threshold;
        }
    }

    /**
     * @typedef {Object} WebCPUResult
     *
     * @property {number|null} reportedCores
     * The result of `navigator.hardwareConcurrency` or `null` if not supported. `navigator.hardwareConcurrency` returns the
     * total number of cores in the system, physical and logical. This is not particularly useful for data computations
     * because logical cores do no improve and, in some cases, even hinder performance in repetitive tasks.
     *
     * @property {number} estimatedIdleCores
     * This number represents the estimated number of cores that can be used to compute a repetitive task, like data
     * computations, in parallel. The result of the estimation is affected by system workload at the time of the detection,
     * if this number is used to spawn threads, it is recommended to re-run the detection algorithm periodically to always
     * use an optimal number of cores when computing data.
     *
     * @property {number} estimatedPhysicalCores
     * Given the reported number of cores and the result of estimated idle cores, this number represents the "best guess"
     * for the total number of physical cores in the system. This number of threads is safe to use on all platforms.
     */

    exports.WebCPU = WebCPU;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
