const {kafka}= require('./client.js');

async function init(){
    const admin=kafka.admin();


    try{
    console.log('Admin conncting...');

    await admin.connect();
    console.log('Admin Connected...');


    const topics=await admin.listTopics();
    console.log(topics);
    console.log('Creating topic delivery agent info...');
    const res=await admin.createTopics({
        topics:[{
            topic:'rider-info',
            numPartitions:2,

        }]
    });
    
    if(res)
    console.log('delivery-agent-info topic created successfully');
    else
    console.log('failed');
    }catch(error){
       throw error;
    }
    finally{
        console.log('Admin Disconnecting...');
        await admin.disconnect();
        console.log('Admin Disconnected...');
    }
}

init();