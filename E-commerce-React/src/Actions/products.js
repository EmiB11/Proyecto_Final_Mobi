import axios from 'axios';
import { BASEURL } from '../Assets/URLS';
import { SEARCH_BY_NAME, GET_CATEGORIES, FILTER_BY_CATEGORY, ORDER_BY_PRICE, ORDER_BY_RATE, ORDER_ALFABETICAMENTE, PUT_PRODUCT_BY_ID } from './Index';
import Swal from "sweetalert2"

export function getProductById(id) {
    return async function (dispatch) {
       try {
          var json = await axios.get(`${BASEURL}/products/${id}`);
          return dispatch({
             type: "GET_PRODUCT_BY_ID",
             payload: json.data
          })
       } catch (err) {
          console.log(err)
       }
    }
 }

 export function getAllProducts(){
    return async function(dispatch) {
       try{
          var json = await axios.get(`${BASEURL}/products`)
          return dispatch({
             type: 'GET_ALL_PRODUCTS',
             payload: json.data
          })
       } catch(err){
          console.log(err)
       }
    }
 }

 export const cleanUp = () => {
   let action = {
     type: 'CLEAN_UP'
  
   }
   return action

}
export function searchByName(name) {
   return async function (dispatch) {
      try {
         var respuesta = await axios.get(`${BASEURL}/products?title=${name}`) //OJO: VER BIEN LA ruta por query del back
         const products = respuesta.data.map(el => {
            return {...el, category:el.Categorium.nombre}
         })
         console.log(products)

         return dispatch({
            type: SEARCH_BY_NAME,
            payload: products
         })
      } catch (err) {
         Swal.fire({
            position: "center",
            icon: "error",
            title: "Oops...",
            text: "No se encontró el producto!",
          });
        }
      }
   } 

   export function orderByPrice(payload) {
      return {
         type: ORDER_BY_PRICE,
         payload
      }
   }

   export function orderAlfabeticamente(payload) {
      return {
         type: ORDER_ALFABETICAMENTE,
         payload
      }
   }
   
   export function orderByRate(payload) {
      return {
         type: ORDER_BY_RATE,
         payload
      }
   }
   
   export function getCategories() {
      return async function (dispatch) {
          try {
              const responseCategories = await axios.get(`${BASEURL}/categories`)
              return dispatch({
                  type: GET_CATEGORIES,
                  payload: responseCategories.data
              })
          } catch (err) {
              console.log(err.response.data)
          }
      }
  }

   export function filterByCategory(payload) {
      return {
         type: FILTER_BY_CATEGORY,
         payload
   
      }
   }


 

   export function getProductsByCat(idCategory) {
      return async function (dispatch) {
         try {
            var json = await axios.get(`${BASEURL}/products/category/${idCategory}`);
            return dispatch({
               type: "GET_PRODUCT_BY_CAT",
               payload: json.data
            })
         } catch (err) {
            console.log(err)
         }
      }
   }

   export function getProductsByCategoryAdmin(idCategory) {
      return async function (dispatch) {
         try {
            var json = await axios.get(`${BASEURL}/products/category/${idCategory}`);
             dispatch({
               type: "GET_PRODUCT_BY_CATEGORY",
               payload: json.data
            })
            
         } catch (err) {
            console.log(err)
         }
      }
   }
  
   export function postProduct(product) {
      return async function () {
        const create = await axios.post(`${BASEURL}/products`, product);
        return create;
      };
    }

    export function putProductByID(id, body) {
      return async function (dispatch) {
        try {
          var json = await axios.put(`${BASEURL}/products/${id}`, body);
          dispatch({
             type: PUT_PRODUCT_BY_ID,
             payload: json.data,
            });
         dispatch(getAllProducts())
        } catch (error) {
          console.log(error);
        }
      };
    }    

    export function putProductStatus(idProduct){
      return async function (dispatch) {
         try {
            const productDisabled = await axios.put(`${BASEURL}/products/changeStatus/${idProduct}`);
            return dispatch({
               type: 'STATUS_PRODUCT',
               payload: productDisabled.data
            })
         } catch (error) {
            console.log(error)
         }finally{
            dispatch(getAllProducts())
         }
      }
    }

    export function cleanProductDetail(){
       return {
          type: 'CLEAN_DETAIL_PRODUCT'
       }
    }
