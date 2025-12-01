export async function fakeUpload(file: File, onProgress: (p:number)=>void) {
    let p = 0;
    return new Promise<{url:string}>(res => {
        const id = setInterval(() => {
            p = Math.min(100, p + 10 + Math.random()*10);
            onProgress(Math.floor(p));
            if (p >= 100) { clearInterval(id); setTimeout(() => res({ url: URL.createObjectURL(file) }), 300); }
        }, 200);
    });
}
