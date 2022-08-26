 import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {Stack, Container } from "react-bootstrap"
import {loginGoogle} from "../../Actions/Auth"
import { auth, provider } from "../../Helpers/firebase";
import { signInWithPopup } from "firebase/auth";
import {useDispatch} from "react-redux";
import styles from "./LoginGoogle.module.css"

import Swal from "sweetalert2"
import logo from "../../Assets/logoGoogle.png"
   
   const LoginGoogle = () => {
    const dispatch = useDispatch();
    const navigate= useNavigate();
    
    
    const handleSesionGoogle = async (e) => {
      e.preventDefault();
      let userGoogle= {}
        try {
          const userG = await signInWithPopup(auth, provider);
          console.log(userG)
           userGoogle = {
            email: userG._tokenResponse.email,
            nombre: userG._tokenResponse.fullName,
            avatar: userG._tokenResponse.photoUrl,
            usuario: userG._tokenResponse.firstName,
          };
          console.log(userGoogle);
          
          dispatch(loginGoogle(userGoogle));
         
        } catch (e) {
          if ( e.message.split("/")[1] === "account-exists-with-different-credential).") {
            Swal.fire({
              title: "Ya tiene una cuenta con el mismo email",
              text: "No puede iniciar sesión en una cuenta no registrada en la base de datos que tenga el mismo email. Use la cuenta con la que se haya registrado",
              icon: "error",
            });
          } else {
            Swal.fire({
                title: "Se produjo un error",
                text: "ocurrió un problema con la sesíon de Google",
                icon: "error",
              });
          }
        }
        
      };
    
  
 
        return (
     <Container>
      <Stack >
             <button 
             type="submit"
             className={styles.botonGoogle}
            onClick={handleSesionGoogle} 
            
            >
             
            <img src={logo} className={styles.logoGoogle} />
           Acceder con Google
           </button>
          
         
         </Stack>
       </Container>
    );
   }
   export default LoginGoogle;