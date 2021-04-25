import ngrok from 'ngrok';

ngrok.connect({ addr: 3000 }).then(function (url: string): void {
    console.log(`URL is: ${url}`);
}).catch(console.log);