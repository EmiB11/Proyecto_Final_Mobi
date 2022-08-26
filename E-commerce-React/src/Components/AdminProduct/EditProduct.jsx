import React, { createRef, useEffect, useState } from 'react'
import { postProduct } from "../../Actions/products"
import { getAllCategories } from "../../Actions/Category.js"
import { getProductById, putProductByID } from "../../Actions/products.js"
import { useSelector, useDispatch } from "react-redux";
import './EditProduct.css'
import Axios from "axios";
import icon from '../../Assets/pencil.svg'
import { validation } from "./validation";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import SidebarAdmin from '../SidebarAdmin/SidebarAdmin';



export default function Product() {
  const { idProduct } = useParams();
  const dispatch = useDispatch()
  let myRef = createRef()
  const categories = useSelector((state) => state.categoriesReducer.categories);
  const product = useSelector((state) => state.productsReducer.detailProduct);
  const [inputImages, setInputImages] = useState("");
  let [index, setIndex] = useState(0)
  var data = {}
  //console.log("producto", product)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductById(idProduct))
  }, [idProduct])

  useEffect(() => {
    setInput({
      title: product.title,
      price: product.price,
      description: product.description,
      categoriaId: product.category,
      images: product.images,
      size: product.size,
      cantidad: product.cantidad,
    });
  }, [product]);

  const [input, setInput] = useState({
    title: product?.title,
    price: product?.price,
    description: product?.description,
    categoriaId: product?.category,
    images: product?.images,
    size: product?.size,
    cantidad: product?.cantidad,
  });

  const [focus, setFocus] = useState({
    title: false,
    price: false,
    description: false,
    size: false,
    categoriaId: false,
    images: false,
    cantidad: false,
  })
  const [inputsize, setInputsize] = useState({
    height: [],
    width: [],
    depth: [],
  });

  //console.log("input", input)
  const [error, setError] = useState({})


  function handleChangeSize(e) {
    setInputsize({
      ...inputsize,
      [e.target.name]: e.target.value,
    });
  }
  if (!input.size) {
    input.size = (inputsize.height + "x").concat((inputsize.width) + "x").concat(inputsize.depth) + "cm"
  }
  useEffect(() => {
    dispatch(getAllCategories())
  }, [])


  //data.title = input.title;
  //data.price = input.price;

  const handleSubmit = (e) => {
    e.preventDefault()

    if (Object.keys(error).length) {

      Swal.fire({
        text: `Datos incorrectos , por favor verifique que los datos ingresados sean correctos`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    else {
      setInput(input)
      console.log("cambios", input)
      dispatch(putProductByID(idProduct, input))
      Swal.fire({
        text: `Producto actualizado con éxito!`,
        icon: "success",
        confirmButtonText: "Ok",
      });
      navigate('/dashboard/admin')
    }

  }


  console.log("input", input)
  const handleTab = (index) => {
    setIndex(index)
    const images = myRef.current.children
    for (let i = 0; i < images.length; i++) {
      images[i].className = images[i].className.replace("active", "")
    }
    images[index].className = "active"
  }

  const handleChange = (name, value) => {
    //console.log(input)
    const newform = { ...input, [name]: value };
    if (typeof value === 'string' || typeof value === 'array') {
      setInput(newform);
      const errors = validation(newform);
      console.log("error", errors)
      setError(errors);
    }
    else {
      setFocus({ ...focus, [name]: value })
    }
    return newform;
  }
  console.log("error", error)
  function handleSelectCategory(e) {
    //console.log(input)

    setInput({
      ...input,
      category: e.target.value,
    });
  }
  /*function addImage(e) {

    setInput({
      ...input,
      images: [...input.images, { url: inputImages, alt: "" }],
    });
    setInputImages("");
  }*/
  //console.log("imagen", input.images)
  let img = "";
  const uploadImage = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
      formData.append("upload_preset", 'preset_pabs');
      //console.log("img", formData)
      const newAxios = Axios.create();
      newAxios
        .post(
          'https://api.cloudinary.com/v1_1/herway-app/image/upload',
          formData
        )
        .then((res) => {
          img = res.data.secure_url;
          setInput({
            ...input,
            images: [...input.images, img],
          });
        });
    }
  };
  function handleDeleteImage(e) {
    e.preventDefault();
    setInput({
      ...input,
      images: input.images.flat().filter((name) => name !== e.target.name),
    });
  }

  return (
    <div className='container-fluid'>
      <div className="row">
        <div className="col-auto col-md-2 col-xl-2 px-0 ">
          <SidebarAdmin />
        </div>

        <div className="col-10">
          <form
            onSubmit={handleSubmit}
          >
            <h2 className="titulo">Editar Producto</h2>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Nombre</span>
              <input onFocus={(e) => handleChange(e.target.name, true)}
                type="text"
                className="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                name='title'
                value={input.title}
                onChange={(e) => handleChange(e.target.name, e.target.value)}>
              </input>
              {focus.title && error.title && <strong style={{color: "red", margin:"10px"}}>{error.title}</strong>}
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Categoría</span>
              <span className="form-control">{input.categoriaId}</span>
              <select className="form-select" aria-label="Default select example" name='categoria'
                onFocus={(e) => handleChange(e.target.name, true)}
                onChange={(e) => handleSelectCategory(e)}>
                <option hidden defaultValue>Modificar categoría</option>
                {categories?.map((category,index) => (
                  <option value={category.id} key={index}>{category.nombre}</option>
                ))}
              </select>
              {focus.categoriaId && error.categoriaId && <strong style={{color: "red", margin:"10px"}}>{error.categoriaId}</strong>}
            </div>
            <div className="input-group">
              <span className="input-group-text">Descripción</span>
              <textarea onFocus={(e) => handleChange(e.target.name, true)}
                className="form-control"
                aria-label="With textarea"
                name='description'
                value={input.description}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              ></textarea>
              {focus.description && error.description && <strong style={{color: "red", margin:"10px"}}>{error.description}</strong>}
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Medidas</span>
              <input onFocus={(e) => handleChange(e.target.name, true)}
                type="text"
                className="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                name='size'
                value={input.size}
                onChange={(e) => handleChange(e.target.name, e.target.value)}>
              </input>
              <span className="input-group-text" id="basic-addon1">Alto</span>
              <input type="number"
                className="form-control"
                placeholder="cm"
                name='height'
                value={inputsize.height}
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => handleChangeSize(e)}>
              </input>
              <span className="input-group-text" id="basic-addon1">Ancho</span>
              <input type="number"
                className="form-control"
                placeholder="cm"
                name='width'
                value={inputsize.width}
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => handleChangeSize(e)}>
              </input>
              <span className="input-group-text" id="basic-addon1">Profundidad</span>
              <input type="number"
                className="form-control"
                placeholder="cm"
                name='depth'
                value={inputsize.depth}
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => handleChangeSize(e)}>
              </input>
            </div>
            <div className="thumb" ref={myRef}>
              {input.images?.flat().map((img, index) => (
                <div key={`div-${index}`}>
                
                
                <img src={img} alt="product" key={`img-${index}`}
                  onClick={() => handleTab(index)}
                />

               <button

                          name={img}
                          onClick={(img) => handleDeleteImage(img)}
                          style={{position:'absolute', right:'0'} }
                          className='btnX'
                          key={`button-${index}`}
                        >
                          X
                        </button>
              
              </div>
               
              ))
              
              
              
              
              
              
              
              
              }
            </div>
            <div>
              <label>Imagenes</label>
              {/*<div>
                <input
                  type="text"
                  placeholder="URL..."
                  value={inputImages}
                  onChange={(e) => setInputImages(e.target.value)}
                />
                <img
                  className="cursor-pointer"
                  onClick={(e) => addImage(e)}

                  alt=""
                />
            </div>*/}
              <div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    uploadImage(e.target.files);
                  }}
                  style={{margin:'1rem 0rem 1rem 0rem'}}
                ></input>
              </div>
              <div className="flex">
    {/*             {input.images &&
                  input.images.flat().map((name) => {
                    return (
                      <div>
                        <img

                          src={name.url}
                          alt={name.url}
                        />
                       
                      </div>
                    );
                  })} */}
              </div>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Precio</span>
              <input onFocus={(e) => handleChange(e.target.name, true)}
                type="number"
                className="form-control"
                placeholder="$ 0.00"
                name='price'
                value={input.price}
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => handleChange(e.target.name, e.target.value)}>
              </input>
              {focus.price && error.price && <strong style={{color: "red", margin:"10px"}}>{error.price}</strong>}
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Stock</span>
              <input onFocus={(e) => handleChange(e.target.name, true)}
                type="number"
                className="form-control"
                placeholder="ingrese stock"
                name='cantidad'
                value={input.cantidad}
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => handleChange(e.target.name, e.target.value)}>
              </input>
              {focus.cantidad && error.cantidad && <strong style={{color: "red", margin:"10px"}}>{error.cantidad}</strong>}
            </div>
            <div>
              <button
                text="Create Product"
                type="submit"
                onClick={(e) => handleSubmit(e)}
                className="btn btn-outline-dark"
                >Actualizar Producto
                
              </button>
              <Link to={`/dashboard/admin`}> <button className='btn btn-outline-dark'>Cancelar</button></Link>
            </div>

          </form>
        </div>
      </div>


    </div>
  )

}