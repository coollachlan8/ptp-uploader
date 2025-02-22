!(function (e, t) {
    "object" == typeof exports && "object" == typeof module ? (module.exports = t()) : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? (exports.FFmpegWASM = t()) : (e.FFmpegWASM = t());
})(self, () =>
    (() => {
        var e = {
                454: (e) => {
                    function t(e) {
                        return Promise.resolve().then(() => {
                            var t = new Error("Cannot find module '" + e + "'");
                            throw ((t.code = "MODULE_NOT_FOUND"), t);
                        });
                    }
                    (t.keys = () => []), (t.resolve = t), (t.id = 454), (e.exports = t);
                },
            },
            t = {};
        function r(a) {
            var o = t[a];
            if (void 0 !== o) return o.exports;
            var s = (t[a] = { exports: {} });
            return e[a](s, s.exports, r), s.exports;
        }
        return (
            (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
            (() => {
                "use strict";
                var e;
                !(function (e) {
                    (e.LOAD = "LOAD"),
                        (e.EXEC = "EXEC"),
                        (e.WRITE_FILE = "WRITE_FILE"),
                        (e.READ_FILE = "READ_FILE"),
                        (e.DELETE_FILE = "DELETE_FILE"),
                        (e.RENAME = "RENAME"),
                        (e.CREATE_DIR = "CREATE_DIR"),
                        (e.LIST_DIR = "LIST_DIR"),
                        (e.DELETE_DIR = "DELETE_DIR"),
                        (e.MOUNT = "MOUNT"),
                        (e.ERROR = "ERROR"),
                        (e.DOWNLOAD = "DOWNLOAD"),
                        (e.PROGRESS = "PROGRESS"),
                        (e.LOG = "LOG");
                })(e || (e = {}));
                const t = new Error("unknown message type"),
                    a = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"),
                    o = (new Error("called FFmpeg.terminate()"), new Error("failed to import ffmpeg-core.js"));
                let s;
                self.onmessage = async ({ data: { id: n, type: E, data: i } }) => {
                    const p = [];
                    let c;
                    try {
                        if (E !== e.LOAD && !s) throw a;
                        switch (E) {
                            case e.LOAD:
                                c = await (async ({ coreURL: t = "https://unpkg.com/@ffmpeg/core@0.12.1/dist/umd/ffmpeg-core.js", wasmURL: a, workerURL: n }) => {
                                    const E = !s,
                                        i = t,
                                        p = a || t.replace(/.js$/g, ".wasm"),
                                        c = n || t.replace(/.js$/g, ".worker.js");
                                    try {
                                        importScripts(i);
                                    } catch {
                                        if (((self.createFFmpegCore = (await r(454)(i)).default), !self.createFFmpegCore)) throw o;
                                    }
                                    return (
                                        (s = await self.createFFmpegCore({ mainScriptUrlOrBlob: `${i}#${btoa(JSON.stringify({ wasmURL: p, workerURL: c }))}` })),
                                        s.setLogger((t) => self.postMessage({ type: e.LOG, data: t })),
                                        s.setProgress((t) => self.postMessage({ type: e.PROGRESS, data: t })),
                                        E
                                    );
                                })(i);
                                break;
                            case e.EXEC:
                                c = (({ args: e, timeout: t = -1 }) => {
                                    s.setTimeout(t), s.exec(...e);
                                    const r = s.ret;
                                    return s.reset(), r;
                                })(i);
                                break;
                            case e.WRITE_FILE:
                                c = (({ path: e, data: t }) => (s.FS.writeFile(e, t), !0))(i);
                                break;
                            case e.READ_FILE:
                                c = (({ path: e, encoding: t }) => s.FS.readFile(e, { encoding: t }))(i);
                                break;
                            case e.DELETE_FILE:
                                c = (({ path: e }) => (s.FS.unlink(e), !0))(i);
                                break;
                            case e.RENAME:
                                c = (({ oldPath: e, newPath: t }) => (s.FS.rename(e, t), !0))(i);
                                break;
                            case e.CREATE_DIR:
                                c = (({ path: e }) => (s.FS.mkdir(e), !0))(i);
                                break;
                            case e.LIST_DIR:
                                c = (({ path: e }) => {
                                    const t = s.FS.readdir(e),
                                        r = [];
                                    for (const a of t) {
                                        const t = s.FS.stat(`${e}/${a}`),
                                            o = s.FS.isDir(t.mode);
                                        r.push({ name: a, isDir: o });
                                    }
                                    return r;
                                })(i);
                                break;
                            case e.DELETE_DIR:
                                c = (({ path: e }) => (s.FS.rmdir(e), !0))(i);
                                break;
                            case e.MOUNT:
                                c = (({ type: e, opts: t, mountpoint: r }) => (s.FS.mount(s.FS.filesystems[e], t, r), !0))(i);
                                break;
                            default:
                                throw t;
                        }
                    } catch (t) {
                        return void self.postMessage({ id: n, type: e.ERROR, data: t.toString() });
                    }
                    c instanceof Uint8Array && p.push(c.buffer), self.postMessage({ id: n, type: E, data: c }, p);
                };
            })(),
            {}
        );
    })()
);
