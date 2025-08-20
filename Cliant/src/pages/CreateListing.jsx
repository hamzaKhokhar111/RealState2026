import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../Firebase';
import  {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'

function CreateListing() {
    const {currentUser}=useSelector(state => state.user);
    const [files, setfiles] = useState([]);
    const navigate=useNavigate();
    const  [error, seterror] = useState(false);
    const [upload,setupload]=useState(false);
    const [loading, setloading] = useState(false);
    const [formdata, setformdata] = useState({
        imageUrls: [],
        name: '', 
        description: '',
        address: '',
        type: '',
        rent:'1',
        bedrooms: 1,
        bathrooms:1,
        regularPrice: 50,
        discountprice: 50,
        offer: false,
        parking: false,
        furnished: false,




    });

    const [imguploaderror,setimguploaderror]=useState(false);
    console.log(formdata);
    const handleImage = (e) => {
        if (files.length > 0 && files.length + formdata.imageUrls.length < 7) {
            setupload(true);
            setimguploaderror(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setformdata({ ...formdata, imageUrls: formdata.imageUrls.concat(urls) });
                setimguploaderror(false);
                setupload(false);
            }).catch((err)=>{
                setimguploaderror('image upload fail');
                setupload(false);
            });
        }else{
            setimguploaderror('you can upload 6 images per listing')
            setupload(false)

        }
    };

const storeImage = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:3000/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return reject(new Error(data.message || "Image upload failed"));
      }

      resolve(`http://localhost:3000${data.file.path}`);
    } catch (error) {
      reject(error);
    }
  });
};



    const removeimg = (index) => {
        setformdata({
            ...formdata,
            imageUrls: formdata.imageUrls.filter((_, i)=> i !==index),
        });
    }; 

const handlechange = (e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
        setformdata({
            ...formdata,
            type: e.target.id
        })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setformdata({
            ...formdata,
            [e.target.id]: e.target.checked
        })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type ==='textarea'){
        setformdata({
            ...formdata,
            [e.target.id] : e.target.value ,

        });
    }


}
const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formdata)
    try {

        if(formdata.imageUrls.length < 1) return seterror ('you must upload atleast one image')
        if(formdata.regularPrice <formdata.discountprice) return seterror ('Discount price must be lower than regular prize')

        setloading(true);
        seterror(false);
        const res= await fetch('/api/listing/create',{
            method: 'POST',
            headers: {
                  'Content-Type' : 'application/json', 
            },
            body: JSON.stringify({
                ...formdata,
                userRef: currentUser._id, 
            }),
        });

        const data= await res.json();
        console.log('created successfully')
        setloading(false);
        if(data.success === false){
            seterror(data.message || "Something went Wrong  ");
            return;
        }
           navigate(`/listing/${data._id}`);

        
    } catch(error) {
        console.log("No create something went wrong")
        seterror(error.message);
        setloading(false);
          
    }
}


    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4' >
                <div className='flex flex-col gap-4 flex-1'>
                    <input onChange={handlechange} value={formdata.name} type="text" placeholder='Name' className='border p-3  rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <textarea value={formdata.description} onChange={handlechange} type="text" placeholder='Description' className='border p-3  rounded-lg' id='description' required />
                    <input value={formdata.address} onChange={handlechange} type="text" placeholder='Adrees' className='border p-3  rounded-lg' id='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handlechange}  checked={formdata.type === "sale" } />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' 
                            onChange={handlechange} 
                            checked={formdata.type === 'rent'}

                              />
                            <span>Rent</span>

                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5'    onChange={handlechange} 
                            checked={formdata.parking} />
                            <span>parking spot</span>

                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5'
                               onChange={handlechange} 
                               checked={formdata.furnished} />
                            <span>Furnished</span>

                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5'
                               onChange={handlechange} 
                               checked={formdata.offer} />
                            <span>Offer</span>

                        </div>
                    </div>

                    <div className='flex flex-wrap gap-6 '>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required 
                               onChange={handlechange} 
                               value={formdata.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required
                               onChange={handlechange} 
                               value={formdata.bathrooms}

                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min='1' max='100000' required
                               onChange={handlechange} 
                               checked={formdata.regularPrice}
                            />
                            <div className='flex flex-col items-center'>

                                <p>Regular price</p>
                                <span className='text-xs'> ($ / month)</span>

                            </div>

                        </div>
                        { formdata.offer && (
                             <div className='flex items-center gap-2'>
                            <input 
  className='p-3 border border-gray-300 rounded-lg' 
  type="number" 
  id='discountprice' 
  min='50' 
  max='100000' 
  required 
  onChange={handlechange} 
  value={formdata.discountprice}
/>

                             <div className='flex flex-col items-center'>
                                 <p>Discount price </p>
                                 <span className='text-xs'> ($ / month)</span>
 
                             </div>
 
                         </div>


                        ) }
                       
                    </div>



                </div>

                <div className='flex flex-col flex-1  gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be cover (max-6)</span></p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setfiles(e.target.files)} className='p-3 border border-gray-300  rounded w-full ' type="file" id='images' accept='image/*' multiple />
                        <button type='button' disabled={upload} onClick={handleImage} className=' p-3 text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{upload ? 'uploading...' : 'Upload'}</button>
                        

                    </div>
                    <p className='text-red-700 '>{imguploaderror && imguploaderror}</p>
                    {
                        formdata.imageUrls.length>0 && formdata.imageUrls.map((urls, index)=>(
                            <div key={urls} className='flex justify-between p-3 border items-center'>
                                <img src={urls} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={()=>removeimg(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' >Delete</button>
                            </div>
                            
                        ))
                    }
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'> {loading ? 'creating...' : 'craete listing'} </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
                    




            </form>

        </main>
    )
}

export default CreateListing
