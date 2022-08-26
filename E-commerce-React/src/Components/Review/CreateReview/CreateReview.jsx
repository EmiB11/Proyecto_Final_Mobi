import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getProductById } from '../../../Actions/products';
import styles from "./Create.module.css"
import { getCommentByProductId, postReview } from '../../../Actions/Comments';
import { getAllUsers} from '../../../Actions/Chat';
import Swal from "sweetalert2";
import { validationFunction } from "./ValidationFunction";
import { FaStar } from 'react-icons/fa'


function CreateReview({socket}) {
//    /* ANIMACION */
//  const [letterClass, setLetterClass] = useState('text-animate')
//  useEffect(() => {
//    return setTimeout(() => {
//      setLetterClass('text-animate-hover')
//    }, 5000)
//  }, [])

//////////////////////////////////

  const { idProduct } = useParams();
  const dispatch = useDispatch()

  const [review, setReview] = useState("")
  const [largoReview, setLargoReview] = useState(0)
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  const [errors, setErrors] = useState({});


  const product = useSelector((state) => state.productsReducer.detailProduct);
  const reviews = useSelector((state) => state.commentReducer.comentariosProducto)
  const user = useSelector((state) => state.loginReducer.userDetail)
  
  //para encontrar el usario administrador
  const allUsers = useSelector((state) => state.chatReducer.allUsers)
  let admin = allUsers?.find( (elem) => elem.rol === "2")



  
  let comentoAntes = reviews?.filter(elem => elem.usuarioId == user?.id).length > 0 ? true : false 
  
  useEffect(() => {
    dispatch(getProductById(idProduct))
    dispatch(getCommentByProductId(idProduct))
    dispatch(getAllUsers())

  }, [idProduct])

  



  const handleReviewChange = (e) => {
    e.preventDefault()
    setLargoReview(e.target.value.length)
    setReview(e.target.value)

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let comment = {
      descripcion: review,
      rating: rating,
      productoId: parseInt(idProduct)
    }

    let errors = validationFunction(comment);
    setErrors(errors);

    if(comentoAntes) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Disculpe, pero solo puede calificar una vez el producto!",
        showConfirmButton: true,
        timer: 15000,
      }).then(function() {
        window.location = "/detail/" + parseInt(idProduct) 
      })
    }else if(!Object.keys(errors).length) {
      
    dispatch(postReview(comment))
    //socket
    socket.emit("notif_newReview", {user, admin, producto: product?.title})
    
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias por valorar el producto!",
      showConfirmButton: true,
      timer: 5000,
    }).then(function() {
      window.location = "/detail/" + parseInt(idProduct) 
    });
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "El formulario contiene errores, revíselo por favor!",
        showConfirmButton: true,
        timer: 5000,
      })
    }


  }

  if (!product.title) return <h1>Loading</h1>
  else {
    return (
      <><div className={styles.título}><h1><b>Qué te pareció tu producto?</b></h1></div>
     
      <div className={styles.container}>
        <div classname={styles.top}></div>
        <div className={styles.containerRating}>
          <div className={styles.detail}>
            {/* <h1><b>Qué te pareció tu producto?</b></h1> */}
            <h3 >{product?.title}</h3>
            <div className={styles.starContainer}>

              {
                // Star Component
                [...Array(5)].map((star, index) => {

                  const ratingValue = index + 1; //para que el rating comience en 1 y no en index 0

                  return (
                    <label>
                      <input
                        className={styles.radioInput}
                        type="radio" name="rating"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)} />
                      <FaStar className={styles.star}
                        size={70}
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}

                        //color={ratingValue <= (hover || rating) ? "black" : "#e4e5e9" }  
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)} />
                    </label>

                  );

                })}
            </div>

            {/* <div className={styles.subtitle}>
      <p className={letterClass} >Malo</p>
      <p className={letterClass} >Excelente</p>
    </div> */}
          </div>
          <div className={styles.productImg}>
            <img src={product?.images[0]} alt="producto" width={130} height={130} />
          </div>
        </div>

        <div className={styles.comentario}>
          <div className={styles.insideComentario}>
            <h4><b>Contale a otras personas que te pareció el producto</b></h4>
            <textarea onChange={(e) => handleReviewChange(e)} name="" id="" cols="80" rows="3" placeholder='Mi producto me pareció...' />
            <div className={styles.underTextArea}>
              <p>El comentario requiere un mínimo de 30 caracteres</p>
              <p>{largoReview} / 1500</p>
            </div>
            <div className={styles.submitBtn}>
              <button className='btn btn-outline-secondary' onClick={(e) => handleSubmit(e)}>Enviar</button>

            </div>
          </div>
        </div>

      </div></>
    )
  }
  
}

export default CreateReview