
const {kafka} =require('./client.js')
const groupid=process.argv[2];


const init=async function init(){

    const consumer=kafka.consumer({groupId:groupid});
    
    console.log('Connecting Consumer...')
    await consumer.connect();
 

    console.log('Consumer subscribing to topic delivery-agent-info');
    await consumer.subscribe({topics:['rider-info'],fromBeginning:true});

    console.log('Consumer subscribed successfully')


    console.log('Looping over each data');
    await consumer.run({
        eachMessage:async ({topic,partition,message,heartbeat,pause})=>{
            console.log({
                group:groupid,
                topic:topic,
                partition:partition,
                key:message.key.toString(),
                value:message.value.toString(),
                headers:message.headers
            })
            
        }
        
    })

    
    const errorTypes=['uncaughtException','unhandledRejection'];


errorTypes.forEach(errorType=>{
    process.on(errorType,async error=>{
        try{
            console.log(`${errorType} - ${error}`)
            await consumer.disconnect();
            process.exit(0);
        }
        catch(_){
            process.exit(1);
        }
    })
});


const signalTypes=['SIGINT', 'SIGTERM'];

signalTypes.forEach(signalType=>{
    process.once(signalType,async()=>{
        try{
        await consumer.disconnect();
        }
        finally{
            process.kill(process.pid,signalType)
        }
        
    })
})

}

init().catch(e=>console.error(e));



init();