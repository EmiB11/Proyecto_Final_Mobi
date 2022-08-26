 import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {changeStatus , editStatusOrder} from "../../../Actions/orders"
import { ListGroup, Button, Spinner } from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux'
import style from "./CheckoutItem.module.css";
import { getUserDetail } from "../../../Actions/Auth";
import {Loader} from "../../Loader/Loader";
 import ConfirmaciónMail from "../../ConfirmaciónMail/ConfirmaciónMail";
import animate from "animate.css"
import { deleteAllCartDB } from "../../../Actions/cart";

const CheckoutConfirm = ({socket}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const datosPago = location.search.split("&");
  const user = useSelector(state => state.loginReducer.userDetail)
  const orden = useSelector(state => state.ordersReducer.orderDetail)
  console.log(user)
  console.log(orden)
  
  //ESTADO DE PAGO
  const status = datosPago[3].split("=");
  const statusPago = status[1];
  console.log(statusPago)
  const dispatch = useDispatch()
  const order = datosPago[4].split("=");
  const idOrder = order[1];
   console.log(datosPago)
  useEffect(() => {
   //dispatch(getUserDetail());
   if(orden){
     dispatch(changeStatus(orden.pedidoId , true))
     dispatch(editStatusOrder(orden.pedidoId , "ENPROCESO"))
     
     //socket
     socket.emit("notif_newOrder", orden)

   }
  },[dispatch , orden])

  function onClick() {
    navigate("/home");
  }
  useEffect(()=>{
  if(user) dispatch(deleteAllCartDB(user?.id))
  },[dispatch,user])

  return (
    <div>
    
    <h6 className='animate__animated animate__fadeInRight' style={{fontWeight:"bolder", textAlign:"center"}}>Confirmada la compra, un representante de MOBI se contactará con usted para definir los detalles del producto.</h6>
      {!orden ? (
        
          <Loader/>
        
      ) : location.search &&
        location.search.includes("collection_status=approved") ? (
        <div className="container">
          <ListGroup>
            <ListGroup.Item variant="success">
              Compra procesada con éxito!
            </ListGroup.Item>

            {/*  acá primer mail */}
           {statusPago==="approved" && statusPago==="approved" ?(
           <ConfirmaciónMail 
              nombre={ user?.nombre}
             email= { user?.email}
             cantidad={ orden?.productos?.map((c)=>c.cantidad)}
             producto={ orden?.productos?.map((p)=>p.producto)}
             total= { orden?.totalPedido}
             direccion={user?.direccion}
             ciudad={ user?.ciudad}
            /> ):(<></>)

           }


            <ListGroup.Item>
              <b>Cliente:</b> {user?.nombre}
            </ListGroup.Item>
            <ListGroup.Item><b>Tel:</b> {user?.telefono}</ListGroup.Item>
            <ListGroup.Item>
              <b>Fecha:{" "}</b>
              {orden?.fechaCreacion.slice(0, 10)}
            </ListGroup.Item>
            <ListGroup.Item><b>ID de compra:</b> {datosPago[2].split('=')[1]} </ListGroup.Item>
            <ListGroup.Item><b>Método de pago:</b> {datosPago[5].split('=')[1] === "credit_card" ? ' Tarjeta de crédito' : ' Tarjeta de Debito'}</ListGroup.Item>
            <ListGroup.Item><b>Estado del pago:</b> Aprobada</ListGroup.Item>
           <ListGroup.Item><b>Dirección:</b> {user?.direccion } Ciudad de {" "} {user?.ciudad}</ListGroup.Item> 
            <ListGroup.Item>
              <b>Productos:</b> {orden?.productos?.map((p) => p.producto + ", ")}
            </ListGroup.Item>
            <ListGroup.Item><b>Costo de envío:</b>{orden?.totalPedido >= 7000 ? ' $ 0' : ' $ 150'}</ListGroup.Item>
            <ListGroup.Item>
              {" "}
           <b>Estado del pedido:</b> Estamos preparando tu pedido
            </ListGroup.Item>
            <ListGroup.Item><b>Total:</b> ${orden?.totalPedido}</ListGroup.Item>
          </ListGroup>
          <Button className="container" variant="dark" onClick={onClick}>
            Volver
          </Button>
        </div>
      ) : (
        <div className="container">
          <ListGroup>
            <ListGroup.Item variant="danger">
              Algo pasó con el pago de tu orden!
            </ListGroup.Item>
            <ListGroup.Item>
              Cliente: {user?.nombre}
            </ListGroup.Item>
            <ListGroup.Item>Tel: {user?.telefono}</ListGroup.Item>
            <ListGroup.Item>
              Fecha:{" "}
              {orden?.fechaCreacion.slice(0, 10)}
            </ListGroup.Item>
            <ListGroup.Item>ID de compra: {order?.pedidoId} </ListGroup.Item>
            <ListGroup.Item>Estado del pago: Rechazado</ListGroup.Item>
            {user?.direccion}
            <ListGroup.Item>
              Productos: {orden?.productos?.map((p) => p.producto + ", ")}
            </ListGroup.Item>
            
            <ListGroup.Item>Total: ${orden?.totalPedido }</ListGroup.Item>
          </ListGroup>
          <Button className="container" variant="dark" onClick={onClick}>
            Volver
          </Button>
        </div>
      )}
    </div>
  );
};
export default CheckoutConfirm; 
