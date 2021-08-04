const mongoose=require('mongoose');
const cities=require('./cities')
const{places,descriptors}=require('./seedHelpers');
const Farmhouse=require('../models/farmhouses');


mongoose.connect('mongodb://localhost:27017/farm-house',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true

});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("DATABASE CONNECTED!");

});
const sample=(array)=>array[Math.floor(Math.random()*array.length)];



const seedDB=async()=>{
    await Farmhouse.deleteMany({});
    for(let i=0;i<200;i++){
        const random157=Math.floor(Math.random()*157);
        const price=Math.floor(Math.random()*3000)+5;

        const farm=new Farmhouse({
            author:'6106b1f17d1f622fd4c6e024',
            location:`${cities[random157].city},${cities[random157].state}`,
            title:`${sample(descriptors)} ${(sample(places))}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est atque quam officia perspiciatis illum tempore, nisi aperiam ducimus, aut, iste deserunt quaerat et temporibus repellendus voluptatem quidem vel explicabo numquam?',
            price,
            geometry:
             {
                 type: 'Point',
                 coordinates:[
                 cities[random157].lnt,
                 cities[random157].lat,
                 ]
                },

            images: [
                {
                 
                  url: 'https://res.cloudinary.com/dk1xvx1mm/image/upload/v1627909154/PAKFARMS/mqjcvxcbxelekz1odhne.jpg',
                  filename: 'PAKFARMS/mqjcvxcbxelekz1odhne'
                },
                {
                  
                  url: 'https://res.cloudinary.com/dk1xvx1mm/image/upload/v1627909153/PAKFARMS/cdpfgh8ga42oqdrbxdcm.jpg',
                  filename: 'PAKFARMS/cdpfgh8ga42oqdrbxdcm'
                }
            ]
            

        })
        await farm.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();

})