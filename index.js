const express=require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app=express();
const ObjectId=require('mongodb').ObjectId;
const port=process.env.PORT || 5000 
const cors =require('cors')
// medilware
app.use(cors());
app.use(express.json());



// cannect uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n0kiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try {
        await client.connect();
        const database = client.db('food-delivery');
        const foodCallection = database.collection('delivery');
        const resultCallection = database.collection('resultFood');
        const restaurentCallection = database.collection('restaurent');
        

        // get api

        app.get('/delivery',async(req,res)=>{
            const cursor=foodCallection.find({});
            const user=await cursor.toArray();
          
            res.send(user)
            
        });

         // post Api
         app.post('/cards/:id',async(req,res)=>{
             const dile=req.body;
            const result =await resultCallection.insertOne(dile);
            res.json(result)

    })


         // post Api
         app.post('/service/',async(req,res)=>{
             const dile=req.body;
            const result =await foodCallection.insertOne(dile);
            res.json(result)

    })

    // get api 
    app.get('/home',async(req,res)=>{
        const cursor=resultCallection.find({});
        const user=await cursor.toArray();
      
        res.send(user)
        
    });
    // get api restaurent
    app.get('/restaurent',async(req,res)=>{
        const cursor=restaurentCallection.find({});
        const user=await cursor.toArray();
      
        res.send(user)
        
    });

        // get single
        app.get('/cards/:id',async(req,res)=>{
            const id =req.params.id;
            const query ={_id:ObjectId(id)};
            const options = {
                projection: { _id: 0},
              };
            const result=await foodCallection.findOne(query,options);
            res.send(result)
        });


        // delete Api
      app.delete('/home/:id',async(req,res)=>{
        const productId=req.params.id;
        const qurey={_id:ObjectId(productId)};
        const result =await resultCallection.deleteOne(qurey);
        console.log('deletein an user',result);
        res.json(result);

        // console.log(id,qurey);

      })

     }

    finally{
         // await client.close();
    }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('runing server 5000')
});
app.listen(port,()=>{
    console.log('live server',port);
})