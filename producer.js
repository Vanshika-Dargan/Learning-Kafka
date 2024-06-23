
const {kafka} =require('./client.js');
const readline=require('readline');


const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
})


async function init(){

    const producer=kafka.producer();
    console.log('Connecting Producer...');

    await producer.connect();

    console.log('Producer Connected..');
    
    rl.setPrompt("% ");
    rl.prompt();


    rl.on('line',async function(l){
        const [agentName,location]=l.split(" ");
        console.log('Producing data to topic delivery-agent-info')
        await producer.send({
           topic:'rider-info',
           messages:[{
            partition:location.toLowerCase()=='north'?1:0,
            key:'current-location',value:JSON.stringify({name:agentName,location:location})
           }]
        });
    
        console.log('Produced successfully');
    }).on("close",async()=>{
        console.log('Disconnecting producer');
        await producer.disconnect();
    
        console.log('Producer disconnected');
    });
}

init();